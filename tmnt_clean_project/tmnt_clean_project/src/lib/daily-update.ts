import { Cron } from 'croner';
import { getCloudflareContext } from '@/lib/cloudflare';
import { getRepositories } from '@/lib/database';
import { findLowestPrice } from '@/lib/price-tracker';

export async function scheduleDailyUpdates() {
  // Schedule daily updates at 2 AM UTC
  const job = Cron('0 2 * * *', async () => {
    console.log('Starting daily price update job...');
    await updateAllComicPrices();
    console.log('Daily price update job completed.');
  });
  
  console.log(`Daily price update job scheduled. Next run: ${job.nextRun()}`);
  return job;
}

export async function updateAllComicPrices() {
  const { env } = getCloudflareContext();
  const repositories = getRepositories(env.DB);
  
  try {
    // Get all comics
    const comics = await repositories.comics.getAllComics();
    console.log(`Updating prices for ${comics.length} comics...`);
    
    // Update prices for all comics
    const updates = await Promise.all(comics.map(async (comic) => {
      try {
        // Find current lowest price
        const lowestPrice = await findLowestPrice(comic.title, comic.issue_number);
        
        // Update lowest price in database
        await repositories.lowestPrices.updateLowestPrice({
          comic_id: comic.id,
          ...lowestPrice
        });
        
        // Add price to price history
        await repositories.prices.addPrice({
          comic_id: comic.id,
          price: lowestPrice.current_price,
          source: lowestPrice.source,
          url: lowestPrice.url,
          condition: lowestPrice.condition
        });
        
        return {
          comicId: comic.id,
          title: comic.title,
          issueNumber: comic.issue_number,
          success: true,
          lowestPrice
        };
      } catch (error) {
        console.error(`Error updating price for comic ${comic.id}:`, error);
        return {
          comicId: comic.id,
          title: comic.title,
          issueNumber: comic.issue_number,
          success: false,
          error: 'Failed to update price'
        };
      }
    }));
    
    // Log results
    const successCount = updates.filter(update => update.success).length;
    console.log(`Price update completed. ${successCount}/${comics.length} comics updated successfully.`);
    
    return {
      success: true,
      message: 'Price update completed',
      totalComics: comics.length,
      successCount,
      failureCount: comics.length - successCount,
      updates
    };
  } catch (error) {
    console.error('Error updating prices:', error);
    return {
      success: false,
      error: 'Failed to update prices',
      message: error.message
    };
  }
}
