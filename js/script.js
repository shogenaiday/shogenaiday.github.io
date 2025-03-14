document.addEventListener('DOMContentLoaded', function() {
  // URLからカテゴリーのパラメータを取得
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'all';

  console.log('選択されたカテゴリー:', category);  // 取得したカテゴリーを表示

  // ✅ ボタンの「active」クラスを追加
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(button => {
    const buttonCategory = button.dataset.category;
    if (buttonCategory === category) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  // 記事を取得して表示
  fetch('./data/articles.json')
    .then(response => response.json())
    .then(data => {
      console.log('取得した記事データ:', data);  // 記事データを表示

      const container = document.getElementById('latest-articles');

      // カテゴリーに基づいて記事をフィルタリング
      const filteredArticles = category === 'all' 
        ? data 
        : data.filter(article => {
            // categoryが配列の場合もあるので、配列かどうかを判定
            const categories = Array.isArray(article.category) ? article.category : [article.category];

            // 記事のカテゴリーが選択したカテゴリーを含むか確認
            return categories.some(c => c === category);
          });

      console.log('フィルタリング後の記事:', filteredArticles);  // フィルタリング後の記事を確認

      container.innerHTML = '';  // コンテナをクリア

      if (filteredArticles.length === 0) {
        container.innerHTML = '<p>該当する記事はありません。</p>';
      } else {
        filteredArticles.forEach(article => {
          container.innerHTML += `
            <div class="col">
              <div class="card h-100 shadow-sm">
                <a href="${article.link}" class="text-decoration-none">
                  <img src="${article.image}" class="card-img-top" alt="${article.title}">
                </a>
                <div class="card-body">
                  <h5 class="card-title">
                    <a href="${article.link}" class="text-dark text-decoration-none">${article.title}</a>
                  </h5>
                  <p class="card-text text-muted">${article.date}</p>
                  <a href="${article.link}" class="btn btn-primary">続きを読む</a>
                </div>
              </div>
            </div>
          `;
        });
      }
    })
    .catch(error => console.error('記事データの読み込みに失敗しました', error));
});
