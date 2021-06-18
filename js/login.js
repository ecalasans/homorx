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
        $.ajax()
    })
});