self.addEventListener('push', (event) => {
    const payload = event.data.json();
    const options = {
      body: payload.title,
      icon: "https://lamhai.com.vn/wp-content/uploads/2023/02/0001-removebg-preview.png"
    };
  
    event.waitUntil(
      self.registration.showNotification('Thông báo từ Công ty TNHH Lâm Hải ', options)
    );
  });
  // Trong service worker
  self.addEventListener('install', event => {
    event.waitUntil(
      self.skipWaiting() // Bỏ qua cài đặt
    );
  });
  
  self.addEventListener('activate', event => {
    event.waitUntil(
      self.clients.claim() // Chấp nhận quyền lợi ngay cả khi có service worker khác đang chạy
    );
  });
  