from django.urls import path
from . import views

urlpatterns = [
    # Rute halam utama
    path('', views.home, name='home'),
    path('pembayaran.html', views.payment, name='payment'),
]