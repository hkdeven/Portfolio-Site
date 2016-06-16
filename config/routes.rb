
Rails.application.routes.draw do
  root 'welcome#index'
  resources :articles
  # resources :projects, controller: 'articles'
  get 'projects', to: 'articles#index'
  get 'contact', to: 'welcome#contact'
  get 'github', to: 'articles#github'
end
