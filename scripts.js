let books = [];
let originalBooks = [];

// Fungsi memuat data dari JSON
async function loadBooks() {
    try {
        const response = await fetch('data.json');
        books = await response.json();
        originalBooks = [...books]; // Simpan data awal
        displayBooks(books);
    } catch (error) {
        document.getElementById('status').innerText = "Gagal memuat data buku.";
        console.error("Error loading books:", error);
    }
}

// Fungsi menampilkan data ke tabel
function displayBooks(bookData) {
    const tableBody = document.getElementById('bookList');
    tableBody.innerHTML = ""; // Kosongkan tabel
    bookData.forEach((book, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${book['Judul Buku']}</td>
                <td>${book['Pengarang']}</td>
                <td>${book['Kategori']}</td>
                <td>${book['Penerbit']}</td>
                <td>${book['Tahun Terbit']}</td>
                <td>${book['ISBN']}</td>
                <td><a href="${book['downloadHref']}" target="_blank">Download</a></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Fungsi reset data ke kondisi awal
function resetBooks() {
    books = [...originalBooks];
    displayBooks(books);
    document.getElementById('status').innerText = "Data dikembalikan ke kondisi awal.";
}

// Kompleksitas algoritma
const algorithmComplexity = {
    iterativeSort: { time: "O(n²)", space: "O(1)" },
    recursiveSort: { time: "O(n log n)", space: "O(n)" },
    iterativeSearch: { time: "O(n)", space: "O(1)" },
    recursiveSearch: { time: "O(n)", space: "O(n)" }
};

// Menampilkan kompleksitas
function displayComplexity(algorithm) {
    const complexity = algorithmComplexity[algorithm];
    if (complexity) {
        const complexityText = `
            <strong>Time Complexity:</strong> ${complexity.time}<br>
            <strong>Space Complexity:</strong> ${complexity.space}
        `;
        document.getElementById('algorithmComplexity').innerHTML = complexityText;
    } else {
        document.getElementById('algorithmComplexity').innerText = "Kompleksitas tidak ditemukan.";
    }
}

// Sortir ISBN Iteratif (Bubble Sort)
function sortBooksByISBNIterative() {
    const sortedBooks = [...books];
    const timeTaken = measureExecutionTime(() => {
        for (let i = 0; i < sortedBooks.length; i++) {
            for (let j = 0; j < sortedBooks.length - 1 - i; j++) {
                if (sortedBooks[j]['ISBN'] > sortedBooks[j + 1]['ISBN']) {
                    [sortedBooks[j], sortedBooks[j + 1]] = [sortedBooks[j + 1], sortedBooks[j]];
                }
            }
        }
    });
    displayBooks(sortedBooks);
    document.getElementById('status').innerText = `Sorting ISBN Iteratif selesai dalam ${timeTaken.toFixed(10)} ms.`;
    displayComplexity('iterativeSort');
    updateComplexityChart("O(n²)", "O(1)");
}

// Sortir ISBN Rekursif (Merge Sort)
function sortBooksByISBNRecursive() {
    const timeTaken = measureExecutionTime(() => {
        books = mergeSortBooksByISBN(books);
    });
    displayBooks(books);
    document.getElementById('status').innerText = `Sorting ISBN Rekursif selesai dalam ${timeTaken.toFixed(10)} ms.`;
    displayComplexity('recursiveSort');
    updateComplexityChart("O(n log n)", "O(n)");
}

function mergeSortBooksByISBN(data) {
    if (data.length <= 1) return data;
    const mid = Math.floor(data.length / 2);
    const left = mergeSortBooksByISBN(data.slice(0, mid));
    const right = mergeSortBooksByISBN(data.slice(mid));
    return merge(left, right);
}

function merge(left, right) {
    let result = [], leftIndex = 0, rightIndex = 0;
    while (leftIndex < left.length && rightIndex < right.length) {
        if (left[leftIndex]['ISBN'] < right[rightIndex]['ISBN']) {
            result.push(left[leftIndex++]);
        } else {
            result.push(right[rightIndex++]);
        }
    }
    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Fungsi untuk pencarian iteratif
function searchBooksIterative() {
    const input = document.getElementById('search').value.toLowerCase();
    const result = [];
    const timeTaken = measureExecutionTime(() => {
        for (let i = 0; i < books.length; i++) {
            if (books[i]['Judul Buku'].toLowerCase().includes(input)) {
                result.push(books[i]);
            }
        }
    });
    displayBooks(result);
    document.getElementById('status').innerText = 
        result.length > 0 ? `Ditemukan ${result.length} buku dalam ${timeTaken.toFixed(10)} ms.` : "Buku tidak ditemukan.";
    displayComplexity('iterativeSearch');
    updateComplexityChart("O(n)", "O(1)");
}

// Fungsi pencarian rekursif
function searchBooksRecursive(data, input, index = 0, result = []) {
    if (index >= data.length) return result;
    if (data[index]['Judul Buku'].toLowerCase().includes(input)) {
        result.push(data[index]);
    }
    return searchBooksRecursive(data, input, index + 1, result);
}

function searchBooksRecursiveWrapper() {
    const input = document.getElementById('search').value.toLowerCase();
    let result = [];
    const timeTaken = measureExecutionTime(() => {
        result = searchBooksRecursive(books, input);
    });
    displayBooks(result);
    document.getElementById('status').innerText = 
        result.length > 0 ? `Ditemukan ${result.length} buku dalam ${timeTaken.toFixed(10)} ms.` : "Buku tidak ditemukan.";
    displayComplexity('recursiveSearch');
    updateComplexityChart("O(n)", "O(n)");
}

// Mengukur waktu eksekusi
function measureExecutionTime(callback) {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
}

// Grafik perbandingan kompleksitas
let complexityChartInstance = null;

function updateComplexityChart(timeComplexity, spaceComplexity) {
    const ctx = document.getElementById('complexityChart').getContext('2d');
    const data = [timeComplexity.length, spaceComplexity.length];
    const labels = ['Time Complexity', 'Space Complexity'];

    if (complexityChartInstance) {
        complexityChartInstance.data.datasets[0].data = data;
        complexityChartInstance.update();
    } else {
        complexityChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
}
let complexityBarChartInstance = null;

// Fungsi untuk memperbarui hasil perhitungan kompleksitas
function updateComplexityResult(timeComplexity, spaceComplexity) {
    const resultText = `
        <strong>Time Complexity:</strong> ${timeComplexity}<br>
        <strong>Space Complexity:</strong> ${spaceComplexity}
    `;
    document.getElementById('complexityResult').innerHTML = resultText;

    // Perbarui grafik batang
    updateComplexityBarChart(timeComplexity, spaceComplexity);
}

// Grafik batang untuk kompleksitas
function updateComplexityBarChart(timeComplexity, spaceComplexity) {
    const ctx = document.getElementById('complexityBarChart').getContext('2d');
    const data = [
        convertComplexityToValue(timeComplexity), 
        convertComplexityToValue(spaceComplexity)
    ];
    const labels = ['Time Complexity', 'Space Complexity'];

    if (complexityBarChartInstance) {
        complexityBarChartInstance.data.datasets[0].data = data;
        complexityBarChartInstance.update();
    } else {
        complexityBarChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Complexity Level',
                    data: data,
                    backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Complexity Level' }
                    }
                }
            }
        });
    }
}

// Konversi kompleksitas ke nilai numerik untuk grafik
function convertComplexityToValue(complexity) {
    const mapping = {
        'O(1)': 1,
        'O(log n)': 2,
        'O(n)': 3,
        'O(n log n)': 4,
        'O(n²)': 5,
        'O(n³)': 6,
    };
    return mapping[complexity] || 0;
}
let algorithmComparisonChart;

function renderAlgorithmComparisonChart() {
    const ctx = document.getElementById('algorithmComparisonChart').getContext('2d');

    const labels = [
        'Sorting Iteratif', 'Sorting Rekursif', 
        'Searching Iteratif', 'Searching Rekursif'
    ];
    const timeComplexities = [5, 4, 3, 3]; // Nilai berdasarkan kompleksitas waktu
    const spaceComplexities = [1, 4, 1, 3]; // Nilai berdasarkan kompleksitas ruang

    if (algorithmComparisonChart) {
        algorithmComparisonChart.data.datasets[0].data = timeComplexities;
        algorithmComparisonChart.data.datasets[1].data = spaceComplexities;
        algorithmComparisonChart.update();
    } else {
        algorithmComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Time Complexity',
                        data: timeComplexities,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Space Complexity',
                        data: spaceComplexities,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Complexity Level',
                        },
                    },
                },
            },
        });
    }
}

// Panggil fungsi ini setelah data dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadBooks().then(() => {
        updateComplexityDisplay();
        renderAlgorithmComparisonChart();
    });
});
// Fungsi untuk memperbarui grafik algoritma (tanpa Space Complexity)
function renderAlgorithmComparisonChart() {
    const ctx = document.getElementById('algorithmComparisonChart').getContext('2d');

    const labels = [
        'Sorting Iteratif', 'Sorting Rekursif', 
        'Searching Iteratif', 'Searching Rekursif'
    ];
    const timeComplexities = [5, 4, 3, 3]; // Nilai berdasarkan kompleksitas waktu

    if (algorithmComparisonChart) {
        algorithmComparisonChart.data.datasets[0].data = timeComplexities;
        algorithmComparisonChart.update();
    } else {
        algorithmComparisonChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Time Complexity',
                        data: timeComplexities,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Complexity Level',
                        },
                    },
                },
            },
        });
    }
}

// Panggil fungsi ini setelah data dimuat
document.addEventListener("DOMContentLoaded", () => {
    loadBooks().then(() => {
        updateComplexityDisplay();
        renderAlgorithmComparisonChart();
    });
});

document.addEventListener("DOMContentLoaded", loadBooks);
