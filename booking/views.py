from django.shortcuts import render

# Create your views here.
def home(request):
    """
    View Menampilkan halaman utama
    """

    return render(request, 'index.html')


def filmDetail(request):
    """
    View Menampilkan halaman detail-film
    """

    return render(request, 'page/detail-film.html')

def pilihKursi(request):
    """
    View Menampilkan halaman pilih kursi
    """

    return render(request, 'page/pilih-kursi.html')

def Pembayaran(request):
    """
    View Menampilkan halaman pilih pembayaran
    """

    return render(request, 'page/pembayaran.html')