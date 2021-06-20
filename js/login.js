$(document).ready(function (){
    $("#login_button").click(function (e){
        e.preventDefault();

        // Pega os valores digitados nos campos
        let usuario = document.getElementById('usuario').value;
        let senha = document.getElementById('senha').value;

        let dados_login = {
            'usuario' : usuario,
            'senha' : senha
        }

        // Faz a requisição para o servidor
        $.ajax({
            url: "http://localhost:8000/sysLogin/",
            type: 'post',
            datatype: 'json',
            data: dados_login,
            success: function (response) {
                sessionStorage.setItem("usuario", response.usuario);
                window.location.replace("http://localhost/homomorphic/sistema.html");
            },
            error: function (response) {
                alert("Erro de login:  verifique seus dados ou contacte o administrador");
            }
        })
    });
});