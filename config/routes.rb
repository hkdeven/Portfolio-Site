Rails.application.routes.draw do
  root 'pages#home'
  get 'projects', to: 'pages#projects'
  get 'contact', to: 'pages#contact'
  get 'github', to: 'pages#github'
  get 'blog', to: 'pages#blog'
  get 'resume', to: 'pages#resume'
  get 'demos', to: 'pages#demos'
  get 'lp', to: 'pages#lp'
  get 'google2ac5bbddc416ebc3', to: 'pages#google2ac5bbddc416ebc3.html'
  resources :articles do
    resources :commments
  end
end
