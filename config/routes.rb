
Rails.application.routes.draw do
  root 'welcome#index'
  resources :articles
  get 'projects', to: 'articles#index'
  get 'contact', to: 'welcome#contact'
  get 'github', to: 'articles#github'
  get 'blog', to: 'articles#blog'
  get 'resume', to: 'articles#resume'
end
