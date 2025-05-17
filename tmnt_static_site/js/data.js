// Sample comic data
const comicsData = [
    {
        id: 1,
        title: "Teenage Mutant Ninja Turtles",
        issueNumber: 1,
        series: "Series 1",
        publisher: "Mirage Studios",
        year: 1984,
        description: "The first appearance of the Teenage Mutant Ninja Turtles. The Turtles' origin is told as they battle against The Shredder for the first time.",
        imageUrl: "images/tmnt-issue-1.jpg",
        lowestPrice: {
            currentPrice: 5250.00,
            currentPriceDate: "2025-05-15",
            previousPrice: 4800.00,
            previousPriceDate: "2025-04-15",
            source: "Heritage Auctions",
            condition: "VF/NM",
            url: "https://example.com/tmnt-1"
        }
    },
    {
        id: 2,
        title: "Teenage Mutant Ninja Turtles",
        issueNumber: 2,
        series: "Series 1",
        publisher: "Mirage Studios",
        year: 1984,
        description: "The Turtles rescue April O'Neil from Baxter Stockman's Mouser robots.",
        imageUrl: "images/tmnt-default-cover.svg",
        lowestPrice: {
            currentPrice: 1200.00,
            currentPriceDate: "2025-05-14",
            previousPrice: 1350.00,
            previousPriceDate: "2025-04-14",
            source: "eBay",
            condition: "VF",
            url: "https://example.com/tmnt-2"
        }
    },
    {
        id: 3,
        title: "Teenage Mutant Ninja Turtles",
        issueNumber: 3,
        series: "Series 1",
        publisher: "Mirage Studios",
        year: 1985,
        description: "The Turtles and Splinter tell April their origin story.",
        imageUrl: "images/tmnt-default-cover.svg",
        lowestPrice: {
            currentPrice: 950.00,
            currentPriceDate: "2025-05-16",
            previousPrice: 900.00,
            previousPriceDate: "2025-04-16",
            source: "MyComicShop",
            condition: "NM",
            url: "https://example.com/tmnt-3"
        }
    },
    {
        id: 4,
        title: "Teenage Mutant Ninja Turtles",
        issueNumber: 4,
        series: "Series 1",
        publisher: "Mirage Studios",
        year: 1985,
        description: "The Turtles are transported to another dimension and meet the Fugitoid.",
        imageUrl: "images/tmnt-default-cover.svg",
        lowestPrice: {
            currentPrice: 725.00,
            currentPriceDate: "2025-05-13",
            previousPrice: 725.00,
            previousPriceDate: "2025-04-13",
            source: "ComicConnect",
            condition: "VF+",
            url: "https://example.com/tmnt-4"
        }
    },
    {
        id: 5,
        title: "Teenage Mutant Ninja Turtles",
        issueNumber: 5,
        series: "Series 1",
        publisher: "Mirage Studios",
        year: 1985,
        description: "The Turtles continue their adventure with the Fugitoid on his home planet.",
        imageUrl: "images/tmnt-default-cover.svg",
        lowestPrice: {
            currentPrice: 450.00,
            currentPriceDate: "2025-05-12",
            previousPrice: 500.00,
            previousPriceDate: "2025-04-12",
            source: "eBay",
            condition: "VF/NM",
            url: "https://example.com/tmnt-5"
        }
    },
    {
        id: 6,
        title: "Teenage Mutant Ninja Turtles",
        issueNumber: 6,
        series: "Series 1",
        publisher: "Mirage Studios",
        year: 1986,
        description: "The Turtles return to Earth and battle a street gang.",
        imageUrl: "images/tmnt-default-cover.svg",
        lowestPrice: {
            currentPrice: 375.00,
            currentPriceDate: "2025-05-11",
            previousPrice: 350.00,
            previousPriceDate: "2025-04-11",
            source: "Heritage Auctions",
            condition: "NM-",
            url: "https://example.com/tmnt-6"
        }
    }
];

// Price history data for detail pages
const priceHistoryData = {
    1: [
        { date: "2025-01-15", price: 4500.00 },
        { date: "2025-02-15", price: 4650.00 },
        { date: "2025-03-15", price: 4750.00 },
        { date: "2025-04-15", price: 4800.00 },
        { date: "2025-05-15", price: 5250.00 }
    ],
    2: [
        { date: "2025-01-14", price: 1100.00 },
        { date: "2025-02-14", price: 1200.00 },
        { date: "2025-03-14", price: 1300.00 },
        { date: "2025-04-14", price: 1350.00 },
        { date: "2025-05-14", price: 1200.00 }
    ],
    3: [
        { date: "2025-01-16", price: 850.00 },
        { date: "2025-02-16", price: 875.00 },
        { date: "2025-03-16", price: 890.00 },
        { date: "2025-04-16", price: 900.00 },
        { date: "2025-05-16", price: 950.00 }
    ],
    4: [
        { date: "2025-01-13", price: 700.00 },
        { date: "2025-02-13", price: 710.00 },
        { date: "2025-03-13", price: 720.00 },
        { date: "2025-04-13", price: 725.00 },
        { date: "2025-05-13", price: 725.00 }
    ],
    5: [
        { date: "2025-01-12", price: 425.00 },
        { date: "2025-02-12", price: 450.00 },
        { date: "2025-03-12", price: 475.00 },
        { date: "2025-04-12", price: 500.00 },
        { date: "2025-05-12", price: 450.00 }
    ],
    6: [
        { date: "2025-01-11", price: 325.00 },
        { date: "2025-02-11", price: 340.00 },
        { date: "2025-03-11", price: 345.00 },
        { date: "2025-04-11", price: 350.00 },
        { date: "2025-05-11", price: 375.00 }
    ]
};
