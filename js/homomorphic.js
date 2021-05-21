let imagem;

// Função para compor a meshgrid
function MeshgridJS(xdim, ydim){
    let x = new Array(xdim);
    let y = new Array(xdim);

    for (let i = 0; i < xdim; i++){
        let temp1 = new Array(ydim);

        for (let j = 0; j < ydim; j++){
            temp1[j] = i;
        }

        x[i] = temp1;
    }

    for (let i = 0; i < xdim; i++){
        let temp2 = new Array(ydim);

        for (let j = 0; j < ydim; j++){
            temp2[j] = j;
        }

        y[i] = temp2;
    }

    return [x, y];
}

$(document).ready(function () {
//////////////////////////
//  Sliders
    $("#gamma_l").slider({
        min : 0,
        max : 100,
        step : 1,
        slide : function (event, ui) {
            var gammaL = ui.value/100;
            var texto = "\\(\\gamma_{L} = " + gammaL +"\\)";
            document.getElementById("gamma_l_label").innerHTML = texto;
            MathJax.typeset();
        }
    });
    $("#gamma_h").slider({
        min: 1,
        max: 100,
        step: 1,
        slide : function (event, ui) {
            var gammaH = (ui.value*10)/100;
            var texto = "\\(\\gamma_{H} = " + gammaH +"\\)";
            document.getElementById("gamma_h_label").innerHTML = texto;
            MathJax.typeset();
        }
    });
    $("#c_slider").slider({
        min: 1,
        max: 100,
        step: 1,
        slide : function (event, ui) {
            var c = (ui.value*10)/100;
            var texto = "\\(c = " + c +"\\)";
            document.getElementById("c_label").innerHTML = texto;
            MathJax.typeset();
        }
    });
    $("#d_zero").slider({
        min: 30,
        max: 3000,
        step: 1,
        slide : function (event, ui) {
            var d_zero = ui.value;
            var texto = "\\(D_{0} = " + d_zero +"\\)";
            document.getElementById("d0_label").innerHTML = texto;
            MathJax.typeset();
        }
    });
///////////////////////////////
    //Abre a caixa de diálogo para selecionar imagem
    $("#carregar").click(function () {
        $("#rx_input").trigger('click');
    });


    $("#rx_input").change(function (e) {
        imagem = document.getElementById("img_container");
        imagem.src = URL.createObjectURL(e.target.files[0]);
    });

    //Carrega a imagem via OpenCV
    $("#img_container").load(function () {
        var mat = cv.imread(imagem);
        var dst = new cv.Mat();
        cv.cvtColor(mat, dst, cv.COLOR_RGBA2GRAY, 0);
        cv.imshow('img_canvas', dst);
        console.log(mat);

        dst.delete();
        mat.delete();
    });

});

function OpenCVready(){
    $("#loading").remove();
};

