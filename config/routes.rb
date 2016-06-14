Rails.application.routes.draw do
  root 'welcome#index'
  resources :articles
  resources :projects, controller: 'articles'
  get 'resume', to: 'welcome#show'
end
