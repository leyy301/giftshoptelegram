// Inisialisasi WebApp Telegram
const tg = window.Telegram.WebApp;
tg.expand();

// Data gift contoh (gift premium Telegram)
const gifts = [
    {
        id: "premium_1month",
        name: "Telegram Premium (1 Month)",
        price: 4.99,
        description: "Give the gift of Telegram Premium for 1 month",
        image: "https://cdn-icons-png.flaticon.com/512/5962/5962463.png",
        currency: "USD",
        gift_type: "premium"
    },
    {
        id: "premium_3months",
        name: "Telegram Premium (3 Months)",
        price: 12.99,
        description: "Give the gift of Telegram Premium for 3 months (save 15%)",
        image: "https://cdn-icons-png.flaticon.com/512/5962/5962463.png",
        currency: "USD",
        gift_type: "premium"
    },
    {
        id: "digital_stickerpack",
        name: "Exclusive Sticker Pack",
        price: 1.99,
        description: "Special animated sticker pack",
        image: "https://cdn-icons-png.flaticon.com/512/5962/5962464.png",
        currency: "USD",
        gift_type: "stickerpack"
    },
    {
        id: "virtual_rose",
        name: "Virtual Rose",
        price: 0.99,
        description: "Send a beautiful virtual rose",
        image: "https://cdn-icons-png.flaticon.com/512/2964/2964302.png",
        currency: "USD",
        gift_type: "virtual"
    }
];

// Tampilkan daftar gift
function displayGifts() {
    const giftsList = document.getElementById('gifts-list');
    giftsList.innerHTML = '';
    
    gifts.forEach(gift => {
        const giftCard = document.createElement('div');
        giftCard.className = 'gift-card';
        
        giftCard.innerHTML = `
            <img src="${gift.image}" alt="${gift.name}" class="gift-image">
            <h3 class="gift-title">${gift.name}</h3>
            <p>${gift.description}</p>
            <p class="gift-price">$${gift.price.toFixed(2)}</p>
            <button class="send-gift" data-id="${gift.id}">Send Gift</button>
        `;
        
        giftsList.appendChild(giftCard);
    });
    
    // Tambahkan event listener untuk tombol send gift
    document.querySelectorAll('.send-gift').forEach(button => {
        button.addEventListener('click', (e) => {
            const giftId = e.target.getAttribute('data-id');
            sendGift(giftId);
        });
    });
}

// Fungsi untuk mengirim gift
function sendGift(giftId) {
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) return;
    
    // Minta Telegram untuk membuka interface pemilihan user
    tg.showPopup({
        title: `Send ${gift.name}`,
        message: `Select a recipient to send this gift to`,
        buttons: [
            {
                id: 'select_recipient',
                type: 'default',
                text: 'Select Friend'
            },
            {
                type: 'cancel',
                text: 'Cancel'
            }
        ]
    }, (buttonId) => {
        if (buttonId === 'select_recipient') {
            // Buka interface pemilihan kontak Telegram
            tg.openTelegramLink(`tg://msg_url?url=${encodeURIComponent(`https://t.me/share/url?url=gift_${gift.id}`)}`);
            
            // Atau gunakan WebApp.requestContact untuk mendapatkan info pengguna
            // tg.requestContact((contact) => {
            //     processGiftPurchase(gift, contact);
            // });
        }
    });
}

// Proses pembelian gift (contoh)
function processGiftPurchase(gift, recipient) {
    // Di aplikasi nyata, Anda akan mengintegrasikan dengan payment system Telegram
    tg.showConfirm(`Confirm sending ${gift.name} to ${recipient.first_name} for $${gift.price.toFixed(2)}?`, (confirmed) => {
        if (confirmed) {
            // Untuk gift premium, Anda bisa menggunakan Telegram Premium API
            if (gift.gift_type === 'premium') {
                tg.sendData(JSON.stringify({
                    action: "gift_premium",
                    gift_id: gift.id,
                    recipient: recipient,
                    amount: gift.price,
                    currency: gift.currency
                }));
            }
            
            // Tampilkan konfirmasi
            tg.showAlert(`🎁 Gift sent successfully!`);
            
            // Tutup web app setelah pengiriman
            setTimeout(() => tg.close(), 2000);
        }
    });
}

// Inisialisasi aplikasi
document.addEventListener('DOMContentLoaded', () => {
    displayGifts();
    
    // Gunakan tema Telegram
    document.body.style.backgroundColor = tg.themeParams.bg_color || '#ffffff';
    document.body.style.color = tg.themeParams.text_color || '#000000';
    
    // Tangkap data dari deep linking (jika ada)
    if (tg.initDataUnsafe.start_param) {
        const giftId = tg.initDataUnsafe.start_param.replace('gift_', '');
        const gift = gifts.find(g => g.id === giftId);
        if (gift) {
            tg.showPopup({
                title: "🎁 Gift Received!",
                message: `You've received a ${gift.name} gift!`,
                buttons: [{
                    type: 'default',
                    text: 'Claim Gift'
                }]
            });
        }
    }
});