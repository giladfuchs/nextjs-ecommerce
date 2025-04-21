import fs from 'fs';

const mockProducts = JSON.parse(fs.readFileSync('./mock_products.json', 'utf8'));
const picsumUrls = JSON.parse(fs.readFileSync('./picsum_urls.json', 'utf8'));

// Optional shuffle function to get varied images
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

const shuffledPicsum = shuffle([...picsumUrls]);

const updatedProducts = mockProducts.map((product, index) => {
    const newImageUrl = shuffledPicsum[index % shuffledPicsum.length];

    return {
        ...product,
        featuredImage: {
            ...product.featuredImage,
            url: newImageUrl
        },
        images: [
            {
                ...product.featuredImage,
                url: newImageUrl
            }
        ]
    };
});

fs.writeFileSync('./mock_products_updated.json', JSON.stringify(updatedProducts, null, 2));
console.log('✅ mock_products_updated.json generated');