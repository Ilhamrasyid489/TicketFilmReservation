from django.urls import path
from . import views

urlpatterns = [
    # Rute halam utama
    path('', views.home, name='home'),
    path('detail-film.html', views.filmDetail, name='filmDetail'),
    path('pilih-kursi.html', views.pilihKursi, name='pilihKursi'),
    path('pembayaran.html', views.Pembayaran, name='Pembayaran'),
]