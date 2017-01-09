Rails.application.routes.draw do
  root 'pages#home'
  get 'projects', to: 'pages#projects'
  get 'contact', to: 'pages#contact'
  get 'github', to: 'pages#github'
  get 'blog', to: 'pages#blog'
  get 'resume', to: 'pages#resume'
  get 'demos', to: 'pages#demos'
  resources :articles do
    resources :commments
  end
end
