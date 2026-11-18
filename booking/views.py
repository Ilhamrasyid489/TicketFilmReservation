from django.shortcuts import render

# Create your views here.
def home(request):
    """
    View Menampilkan halaman utama
    """

    return render(request, 'index.html')