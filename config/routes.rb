Rails.application.routes.draw do
  resources :articles
  resources :projects, controller: 'articles'
  get 'resume', to: 'welcome#show'
  root 'welcome#index'
end
