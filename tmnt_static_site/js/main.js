// Main JavaScript for TMNT Comic Price Tracker
document.addEventListener('DOMContentLoaded', function() {
    // Render comic cards on the home page
    if (document.getElementById('comics-container')) {
        renderComicCards();
    }

    // Set up search functionality
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', searchComics);
    }

    // Set up add comic button
    const addComicButton = document.getElementById('add-comic-button');
    if (addComicButton) {
        addComicButton.addEventListener('click', function() {
            window.location.href = 'add-comic.html';
        });
    }

    // Handle add comic form submission
    const addComicForm = document.getElementById('add-comic-form');
    if (addComicForm) {
        addComicForm.addEventListener('submit', handleAddComicSubmit);
    }
});

// Render comic cards on the home page
function renderComicCards() {
    const comicsContainer = document.getElementById('comics-container');
    comicsContainer.innerHTML = '';

    comicsData.forEach(comic => {
        const card = createComicCard(comic);
        comicsContainer.appendChild(card);
    });
}

// Create a comic card element
function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card fade-in';
    
    // Calculate price change
    const currentPrice = comic.lowestPrice.currentPrice;
    const previousPrice = comic.lowestPrice.previousPrice;
    let priceChange = 0;
    let priceDirection = 'same';
    
    if (previousPrice) {
        priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
        priceDirection = currentPrice > previousPrice ? 'up' : (currentPrice < previousPrice ? 'down' : 'same');
    }
    
    // Format dates
    const currentPriceDate = new Date(comic.lowestPrice.currentPriceDate).toLocaleDateString();
    const previousPriceDate = comic.lowestPrice.previousPriceDate 
        ? new Date(comic.lowestPrice.previousPriceDate).toLocaleDateString() 
        : 'N/A';
    
    card.innerHTML = `
        <div class="comic-card-content">
            <div class="comic-cover">
                <a href="${comic.lowestPrice.url}" target="_blank">
                    <img src="${comic.imageUrl}" alt="${comic.title} #${comic.issueNumber} Cover">
                    <div class="buy-overlay">Click to Buy</div>
                </a>
            </div>
            <div class="comic-details">
                <h3 class="comic-title">
                    <a href="comic-detail.html?id=${comic.id}">${comic.title} #${comic.issueNumber}</a>
                </h3>
                <p class="comic-series">${comic.series}</p>
                
                <div class="price-container">
                    <div class="price-box">
                        <p class="price-label">Current Price:</p>
                        <p class="price-value">$${currentPrice.toFixed(2)}</p>
                        <p class="price-date">Found on: ${currentPriceDate}</p>
                    </div>
                    
                    <div class="price-box">
                        <p class="price-label">Previous Price:</p>
                        <p class="price-value">${previousPrice ? '$' + previousPrice.toFixed(2) : 'N/A'}</p>
                        <p class="price-date">Found on: ${previousPriceDate}</p>
                    </div>
                    
                    ${previousPrice ? `
                        <div class="price-change price-${priceDirection}">
                            ${priceDirection === 'up' ? '↑' : (priceDirection === 'down' ? '↓' : '→')} 
                            ${Math.abs(priceChange).toFixed(1)}%
                        </div>
                    ` : ''}
                </div>
                
                <div class="comic-source">
                    <div class="source-info">
                        <p>Source: ${comic.lowestPrice.source}</p>
                        <p>Condition: ${comic.lowestPrice.condition || 'Not specified'}</p>
                    </div>
                    
                    <a href="${comic.lowestPrice.url}" target="_blank" class="buy-button">Buy Now</a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Search comics functionality
function searchComics() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const searchBy = document.getElementById('search-by').value;
    const comicsContainer = document.getElementById('comics-container');
    
    comicsContainer.innerHTML = '';
    
    if (!searchInput.trim()) {
        renderComicCards();
        return;
    }
    
    const filteredComics = comicsData.filter(comic => {
        switch (searchBy) {
            case 'title':
                return comic.title.toLowerCase().includes(searchInput);
            case 'series':
                return comic.series.toLowerCase().includes(searchInput);
            case 'publisher':
                return comic.publisher.toLowerCase().includes(searchInput);
            default:
                return false;
        }
    });
    
    if (filteredComics.length === 0) {
        comicsContainer.innerHTML = `
            <div class="text-center py-8">
                <p class="text-gray-500">No comics found matching your search.</p>
            </div>
        `;
        return;
    }
    
    filteredComics.forEach(comic => {
        const card = createComicCard(comic);
        comicsContainer.appendChild(card);
    });
}

// Handle add comic form submission
function handleAddComicSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const issueNumber = parseInt(document.getElementById('issueNumber').value);
    const series = document.getElementById('series').value;
    const publisher = document.getElementById('publisher').value;
    const year = parseInt(document.getElementById('year').value);
    const description = document.getElementById('description').value;
    const imageUrl = document.getElementById('imageUrl').value || 'images/tmnt-default-cover.svg';
    
    // Validate form
    if (!title || isNaN(issueNumber) || !series || !publisher || isNaN(year)) {
        showError('Please fill in all required fields');
        return;
    }
    
    if (issueNumber <= 0) {
        showError('Issue number must be a positive number');
        return;
    }
    
    if (year < 1900 || year > new Date().getFullYear()) {
        showError('Please enter a valid year');
        return;
    }
    
    // Create new comic object
    const newComic = {
        id: comicsData.length + 1,
        title,
        issueNumber,
        series,
        publisher,
        year,
        description,
        imageUrl,
        lowestPrice: {
            currentPrice: 0,
            currentPriceDate: new Date().toISOString().split('T')[0],
            source: 'Pending',
            condition: 'Unknown',
            url: '#'
        }
    };
    
    // In a real app, this would send data to a server
    // For this static demo, we'll just show a success message
    
    const formContainer = document.querySelector('.form-container');
    formContainer.innerHTML = `
        <h2 class="form-title">Comic Added Successfully!</h2>
        <p class="form-description">Your comic has been added to the tracking system. We'll start searching for the lowest price across various marketplaces.</p>
        <div class="comic-card fade-in">
            <div class="comic-card-content">
                <div class="comic-cover">
                    <img src="${newComic.imageUrl}" alt="${newComic.title} #${newComic.issueNumber} Cover">
                </div>
                <div class="comic-details">
                    <h3 class="comic-title">${newComic.title} #${newComic.issueNumber}</h3>
                    <p class="comic-series">${newComic.series}</p>
                    <p>Publisher: ${newComic.publisher}</p>
                    <p>Year: ${newComic.year}</p>
                    ${newComic.description ? `<p>Description: ${newComic.description}</p>` : ''}
                </div>
            </div>
        </div>
        <div class="mt-4 text-center">
            <a href="index.html" class="btn btn-primary">Back to Home</a>
        </div>
    `;
}

// Show error message
function showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (!errorContainer) {
        const formContainer = document.querySelector('.form-container');
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-container';
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formContainer.insertBefore(errorDiv, formContainer.firstChild);
    } else {
        errorContainer.textContent = message;
    }
}

// Load comic detail page
function loadComicDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = parseInt(urlParams.get('id'));
    
    if (isNaN(comicId) || comicId < 1 || comicId > comicsData.length) {
        window.location.href = 'index.html';
        return;
    }
    
    const comic = comicsData.find(c => c.id === comicId);
    if (!comic) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page content with comic details
    document.getElementById('comic-title').textContent = `${comic.title} #${comic.issueNumber}`;
    document.getElementById('comic-cover').src = comic.imageUrl;
    document.getElementById('comic-series').textContent = comic.series;
    document.getElementById('comic-publisher').textContent = comic.publisher;
    document.getElementById('comic-year').textContent = comic.year;
    
    if (comic.description) {
        document.getElementById('comic-description').textContent = comic.description;
    } else {
        document.querySelector('.comic-detail-description').style.display = 'none';
    }
    
    // Format dates
    const currentPriceDate = new Date(comic.lowestPrice.currentPriceDate).toLocaleDateString();
    
    // Update price information
    document.getElementById('current-price').textContent = `$${comic.lowestPrice.currentPrice.toFixed(2)}`;
    document.getElementById('price-date').textContent = currentPriceDate;
    document.getElementById('price-source').textContent = comic.lowestPrice.source;
    document.getElementById('price-condition').textContent = comic.lowestPrice.condition || 'Not specified';
    
    // Set buy button link
    document.getElementById('buy-button').href = comic.lowestPrice.url;
    
    // Render price history chart
    renderPriceHistoryChart(comicId);
}

// Render price history chart
function renderPriceHistoryChart(comicId) {
    const history = priceHistoryData[comicId];
    if (!history || !history.length) return;
    
    const chartContainer = document.getElementById('chart-container');
    const comic = comicsData.find(c => c.id === comicId);
    
    // Create chart HTML (simplified version)
    let chartHtml = '<div class="chart-bars">';
    
    // Find min and max prices for scaling
    const prices = history.map(item => item.price);
    const maxPrice = Math.max(...prices) * 1.1; // Add 10% padding
    const minPrice = Math.min(...prices) * 0.9; // Subtract 10% padding
    const range = maxPrice - minPrice;
    
    // Generate bars
    history.forEach((item, index) => {
        const height = ((item.price - minPrice) / range) * 100;
        const date = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        chartHtml += `
            <div class="chart-bar-container">
                <div class="chart-bar" style="height: ${height}%;" title="$${item.price.toFixed(2)}"></div>
                <div class="chart-label">${date}</div>
            </div>
        `;
    });
    
    chartHtml += '</div>';
    
    // Add price scale
    chartHtml += `
        <div class="chart-scale">
            <div class="chart-scale-max">$${maxPrice.toFixed(2)}</div>
            <div class="chart-scale-mid">$${((maxPrice + minPrice) / 2).toFixed(2)}</div>
            <div class="chart-scale-min">$${minPrice.toFixed(2)}</div>
        </div>
    `;
    
    chartContainer.innerHTML = chartHtml;
    
    // Add CSS for the chart
    const style = document.createElement('style');
    style.textContent = `
        .chart-bars {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            height: 200px;
            padding: 20px 40px;
            border-bottom: 1px solid #ccc;
            position: relative;
        }
        
        .chart-bar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: ${100 / history.length}%;
        }
        
        .chart-bar {
            width: 30px;
            background-color: var(--tmnt-green);
            border-radius: 4px 4px 0 0;
            transition: height 0.5s ease;
        }
        
        .chart-label {
            margin-top: 8px;
            font-size: 12px;
            color: var(--gray-600);
        }
        
        .chart-scale {
            position: absolute;
            left: 0;
            top: 0;
            height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px 0;
            font-size: 12px;
            color: var(--gray-600);
        }
        
        .chart-scale-max, .chart-scale-mid, .chart-scale-min {
            margin-left: 10px;
        }
    `;
    
    document.head.appendChild(style);
    
    // Update price history details
    document.getElementById('current-price-value').textContent = `$${comic.lowestPrice.currentPrice.toFixed(2)}`;
    document.getElementById('current-price-date').textContent = new Date(comic.lowestPrice.currentPriceDate).toLocaleDateString();
    document.getElementById('current-price-source').textContent = comic.lowestPrice.source;
    document.getElementById('current-price-condition').textContent = comic.lowestPrice.condition || 'Unknown';
    
    if (comic.lowestPrice.previousPrice && comic.lowestPrice.previousPriceDate) {
        document.getElementById('previous-price-value').textContent = `$${comic.lowestPrice.previousPrice.toFixed(2)}`;
        document.getElementById('previous-price-date').textContent = new Date(comic.lowestPrice.previousPriceDate).toLocaleDateString();
        document.getElementById('previous-price-source').textContent = comic.lowestPrice.source;
        document.getElementById('previous-price-condition').textContent = comic.lowestPrice.condition || 'Unknown';
    } else {
        document.querySelector('.previous-price-card').style.display = 'none';
    }
}
