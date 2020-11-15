//Khai báo sự kiện khi người dùng click vào nút xác nhận

var validate = new Validation();
var mangSinhVien = []; //Mảng chứa nội dung sinh viên được người dùng thêm vào sau khi nhập liệu

document.querySelector('#btnXacNhan').onclick = function () {
    //Tạo đối tượng chứa dữ liệu nhập từ người dùng
    var sv = new SinhVien();
    sv.maNhanVien = document.querySelector('#maNhanVien').value;
    sv.tenNhanVien = document.querySelector('#tenNhanVien').value;
    sv.loaiSinhVien = document.querySelector('#loaiSinhVien').value;
    sv.luongCoBan = document.querySelector('#luongCoBan').value;
    sv.soGioLam = document.querySelector('#soGioLam').value;
    console.log('sinh viên', sv);

    //----------------Kiểm tra dữ liệu hợp lệ ----------------
    // -------Kiểm tra rổng-----------
    var valid = true;

    valid &= validate.kiemTraRong(sv.maNhanVien, 'Mã nhân viên', '#kiemTraRong-maNhanVien') 
    & validate.kiemTraRong(sv.tenNhanVien, 'Tên sinh viên', '#kiemTraRong-tenNhanVien') 
    & validate.kiemTraRong(sv.luongCoBan, 'Lương cơ bản', '#kiemTraRong-luongCoBan')
    & validate.kiemTraRong(sv.soGioLam,'Số giờ làm', '#kiemTraRong-soGioLam');

    // Kiểm tra định dạng
    valid &= validate.kiemTraTatKyTu(sv.tenNhanVien, 'Tên nhân viên', '#kiemTraDinhDang-tenNhanVien');
    //Kiểm tra độ dai

    valid &= validate.kiemTraDoDai(sv.maNhanVien,'Mã nhân viên','#kiemTraDoDai-maNhanVien',4,6);

    valid &= validate.kiemTraGiaTri(sv.luongCoBan,'Lương cơ bản' ,'#kiemTraGiaTri-luongCoBan',1000000,20000000)
    & validate.kiemTraGiaTri(sv.soGioLam,'Số giờ làm','#kiemTraGiaTri-soGioLam',50,150);
    


    if (!valid) {
        return;
    }

    //Mỗi khi người dùng xác nhận thêm sinh viên vào mảng
    mangSinhVien.push(sv);

    console.log('mảng sinh viên', mangSinhVien);

    //Gọi hàm tạo bảng
    renderTableSinhVien(mangSinhVien);
    //Gọi hàm lưu mảng sinh viên vào local storage
}


var renderTableSinhVien = function (arrSinhVien) {
    var noiDungTable = '';
    for (var i = 0; i < arrSinhVien.length; i++) {


        //Mỗi lần duyệt lấy ra 1 đối tượng sinh viên từ trong mangSinhVien
        var sv = new SinhVien();
        sv.maNhanVien = arrSinhVien[i].maNhanVien;
        sv.tenNhanVien = arrSinhVien[i].tenNhanVien;
        sv.luongCoBan = arrSinhVien[i].luongCoBan;
        sv.soGioLam = arrSinhVien[i].soGioLam;
        sv.loaiSinhVien = arrSinhVien[i].loaiSinhVien;
        noiDungTable += `
                <tr>
                    <td>${sv.maNhanVien}</td>
                    <td>${sv.tenNhanVien}</td>
                    <td>${sv.loaiSinhVien}</td>
                    <td>${sv.luongCoBan}</td>
                    <td>${sv.tinhLuong()}</td>
                    <td>${sv.soGioLam}</td>
                    <td>${sv.xepLoaiNhanVien()}</td>
                    <td>
                        <button class="btn btn-danger" onclick="xoaSinhVien('${sv.maNhanVien}')">Xóa</button>      
                    </td>
                </tr> 
        `
    }
    //dom đến thẻ tbody gán innerHTML của tbody = noiDungTable
    document.querySelector('#tableSinhVien').innerHTML = noiDungTable;
    console.log(noiDungTable);
}


//Định nghĩa hàm khi nút xóa sinh viên click
var xoaSinhVien = function (maSV) {
    // alert(maSV);
    for (var i = mangSinhVien.length - 1; i >= 0; i--) {
        //Mỗi lần duyệt lấy ra 1 sinh viên trong mảng
        var sv = mangSinhVien[i];
        //Kiểm tra sinh nào trong mảng có maSinhVien === maSV được click thì xóa
        if (sv.maNhanVien === maSV) {
            mangSinhVien.splice(i, 1); //Xóa tại vị trí index tìm được và xóa 1 phần tử
        }
    }
    //Gọi hàm tạo lại bảng truyền vào mangSinhVien sau khi xóa
    renderTableSinhVien(mangSinhVien);
    //Có thể lưu vào localstorage 
    // luuDuLieuLocalStorage()
}
var luuDuLieuLocalStorage = function () {

    //Biến mangSinhVien thành chuỗi 
    var sMangSinhVien = JSON.stringify(mangSinhVien);
    //Lưu dữ liệu vào localstorage bằng phương thức setItem(key,value);
    localStorage.setItem('mangSinhVien', sMangSinhVien)

}


var layDuLieuLocalStorage = function () {
    //Kiểm tra xem localstorage có dữ liệu hay không
    if (localStorage.getItem('mangSinhVien')) {
        //Dữ liệu được lấy từ localstorage là dạng chuỗi
        var sMangSinhVien = localStorage.getItem('mangSinhVien');
        //Biến chuỗi dữ liệu thành mảng và gán cho biến mangSinhVien
        mangSinhVien = JSON.parse(sMangSinhVien);
        //Gọi hàm tạo bảng sinh viên từ mangSinhVien được lấy giá trị từ localstorage
        renderTableSinhVien(mangSinhVien);
    }
}

//Gọi hàm load data từ storage khi browser load
layDuLieuLocalStorage();

