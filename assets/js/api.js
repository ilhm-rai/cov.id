function generateNumber(number) {
    var reverse = number.toString().split('').reverse().join(''),
        thousand = reverse.match(/\d{1,3}/g);
    generated = thousand.join(',').split('').reverse().join('');
    return generated;
}


var worldCovidDataUrl = {
    "url": "https://api.covid19api.com/summary",
    "method": "GET",
    "timeout": 0,
};


function getQuickCovidData() {
    $.ajax(worldCovidDataUrl).then(function (response) {
        response.Countries.forEach(function (data) {
            if (data.Country.toLowerCase() == "indonesia") {
                let indonesiaActiveCases = data.TotalConfirmed - (data.TotalDeaths + data.TotalRecovered);
                document.getElementById('vQuickIndonesiaData').innerHTML =
                    `<div class="md-fb-50 fb-25">
                        <div class="card card-quick bg-lightgrey">
                            <div class="data-group">
                                <p class="text-green data">${generateNumber(data.TotalConfirmed)}</p>
                                <p class="badge bg-green"><span class="fa fa-angle-double-up"></span> ${generateNumber(data.NewConfirmed)}</p>
                            </div>
                            <p>Terkonfirmasi</p>
                        </div>
                    </div>
                    <div class="md-fb-50 fb-25">
                        <div class="card card-quick bg-lightgrey">
                            <div class="data-group">
                                <p class="text-red data">${generateNumber(data.TotalDeaths)}</p>
                                <p class="badge bg-red"><span class="fa fa-angle-double-up"></span> ${generateNumber(data.NewDeaths)}</p>
                            </div>
                            <p>Meninggal</p>
                        </div>
                    </div>
                    <div class="md-fb-50 fb-25">
                        <div class="card card-quick bg-lightgrey">
                            <div class="data-group">
                                <p class="text-blue data">${generateNumber(data.TotalRecovered)}</p>
                                <p class="badge bg-blue"><span class="fa fa-angle-double-up"></span> ${generateNumber(data.NewRecovered)}</p>
                            </div>
                            <p>Sembuh</p>
                        </div>
                    </div>
                    <div class="md-fb-50 fb-25">
                        <div class="card card-quick bg-lightgrey">
                            <p class="text-yellow data" id="x">${generateNumber(indonesiaActiveCases)}</p>
                            <p>Dirawat</p>
                        </div>
                    </div>`;
            }
        });

        $(document).ready(function () {
            $('.data').counterUp();
        });

    }, function (e) {
        document.getElementById('vQuickIndonesiaData').innerHTML = `
        <div class="fb-100">
            <div class="card card-quick bg-lightgrey">
                <p>Kami tidak dapat terhubung ke server <a href="https://covid19api.com/" class="text-green">covid19api.com</a></p>
                <p class="bold">Periksa koneksi internet anda.</p>
            </div>
        </div>
        `;
    });
}

function getWorldCovidData() {
    $.ajax(worldCovidDataUrl).then(function (response) {
        let globalHTML = "";
        let allCases = "";
        globalHTML += `
        <p class="text-green data">${generateNumber(response.Global.TotalConfirmed)}</p>
        <p class="data-desc">Terkonfirmasi</p>
        <p class="text-red data">${generateNumber(response.Global.TotalDeaths)}</p>
        <p class="data-desc">Meninggal</p>
        <p class="text-blue data">${generateNumber(response.Global.TotalRecovered)}</p>
        <p class="data-desc">Sembuh</p>
        <p class="text-yellow data">${generateNumber(response.Global.TotalConfirmed - (response.Global.TotalDeaths + response.Global.TotalRecovered))}</p>
        <p class="data-desc">Dirawat</p>
        `;
        document.getElementById("data").innerHTML = globalHTML;

        $(document).ready(function () {
            $('.data').counterUp();
        });

        allCases += `
        <thead>
            <tr>
                <th>No.</th>
                <th class="text-left">Negara</th>
                <th>Terkonfirmasi</th>
                <th>Meninggal</th>
                <th>Sembuh</th>
                <th>Dirawat</th>
            </tr>
        </thead>
        <tbody>
        `;

        var num = 0;
        response.Countries.sort(function (a, b) { return a.TotalConfirmed - b.TotalConfirmed; }).reverse().forEach(function (data) {
            let totalActive = data.TotalConfirmed - (data.TotalDeaths + data.TotalRecovered);
            allCases += `
            <tr>
                <td><p>${num += 1}.</p></td>
                <td class="text-left"> ${data.Country}</td>
                <td>${generateNumber(data.TotalConfirmed)}</td>
                <td>${generateNumber(data.TotalDeaths)}</td>
                <td>${generateNumber(data.TotalRecovered)}</td>
                <td>${generateNumber(totalActive)}</td>
            </tr>
            `;
        });
        allCases += `</tbody>`;

        document.getElementById("dataTable").innerHTML = allCases;
        $('#dataTable').DataTable({
            paging: false,
            ordering: false,
            info: false
        });
        $('#dataTable').wrap(`<div class="overflow"><div class="box"></div></div>`);
        $('#dataTable_filter label').replaceWith(`<input type="search" class="global_filter form-custom" placeholder="Ketik disini untuk mencari..." aria-controls="dataTable" style="margin-bottom: 20px;" id="global_filter">
        `);
        $(document).ready(function () {
            $('input.global_filter').on('keyup click', function () {
                $('#dataTable').DataTable().search(
                    $('#global_filter').val()
                ).draw();
            });
        });
    }, function () {
        $.when($.ready).then(function () {
            document.getElementById("data").innerHTML = `
                <p>Kami tidak dapat terhubung ke server <a href="https://covid19api.com/" class="text-green">covid19api.com</a></p>
                <p class="bold">Periksa koneksi internet anda.</p>
            `;
            document.getElementById("dataTable").innerHTML = `
                <tr>
                    <td>
                        <p>Kami tidak dapat terhubung ke server <a href="https://covid19api.com/" class="text-green">covid19api.com</a></p>
                        <p class="bold">Periksa koneksi internet anda.</p>
                    </td>
                </tr>
            `;
        });
    });
}