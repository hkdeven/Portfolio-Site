
Rails.application.routes.draw do
  root 'welcome#index'
  resources :articles
  resources :projects, controller: 'articles'
  get 'projects', to: 'articles#index'
  get 'contact', to: 'welcome#show'
  get 'github', to: 'articles#show'
end
