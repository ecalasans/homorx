const cv = require('../opencv');

// Função para compor a meshgrid
function MeshgridJS(xdim, ydim){
    let u = new Array();
    let v = new Array();
    //let x_dim = xdim;
    //let y_dim = ydim;

    for (let i = 0; i < xdim; i++){
        for (let j = 0; j < ydim; j++){
            u.push(i);
        }
    }

    for (let i = 0; i < xdim; i++){
        for (let j = 0; j < ydim; j++){
            v.push(j);
        }
    }
    return {
        'u': u,
        'v': v
    };
}

//Função Gaussiana Modificaca
function GaussModif(gamma_l = 0.0, gamma_h = 0.0, c = 0.0, D0 = 0.0, imagem) {
    //Calcula o tamanho ótimo para a FFT
    let im_h = cv.getOptimalDFTSize(imagem.rows);
    let im_w = cv.getOptimalDFTSize(imagem.cols);

    //Coordenadas do centro
    let u_c = new cv.Mat(im_h, im_w, cv.CV_64F, new cv.Scalar(im_h/2));
    let v_c = new cv.Mat(im_h, im_w, cv.CV_64F, new cv.Scalar(im_w/2));

    // Inclinacao da curva
    let m_c = new cv.Mat(im_h, im_w, cv.CV_64F, new cv.Scalar(c));

    // Frequencia de corte
    let m_d0 = new cv.Mat(im_h, im_w, cv.CV_64F, new cv.Scalar(D0));

    //Matriz de Coordenadas
    let arr = MeshgridJS(im_h,im_w);
    let a = arr['u'];
    a = cv.matFromArray(im_h, im_w, cv.CV_64F, a);
    let b = arr['v'];
    b = cv.matFromArray(im_h, im_w, cv.CV_64F, b);

    //Etapas de cálculo de H(u,v)
    // 1.  Cálculo de D(u,v)/D0
    let u_uc = new cv.Mat();
    let v_vc = new cv.Mat();
    // (u - u_c)^2
    cv.subtract(a, u_c, u_uc);
    cv.multiply(u_uc, u_uc, u_uc)
    a.delete();

    // (v - v_c)^2
    cv.subtract(b, v_c, v_vc);
    cv.multiply(v_vc, v_vc, v_vc)
    b.delete();

    // [(u_uc)^2 + (v_vc)^2]^2
    let soma_uuc_vvc_2 = new cv.Mat();
    cv.add(u_uc, v_vc, soma_uuc_vvc_2);
    cv.multiply(soma_uuc_vvc_2, soma_uuc_vvc_2, soma_uuc_vvc_2);
    u_uc.delete();
    v_vc.delete();

    // Divisão por D0^2
    let d_d0 = new cv.Mat();
    cv.multiply(m_d0, m_d0, m_d0);
    cv.divide(soma_uuc_vvc_2, m_d0, d_d0);
    soma_uuc_vvc_2.delete();
    m_d0.delete();

    // 2.  Cálculo de -c * d_d0
    let menos_um = new cv.Mat(im_h, im_w, cv.CV_64F, new cv.Scalar(-1));
    console.log(menos_um.doubleAt(0,0));
    let menos_c = new cv.Mat();

    // -c
    cv.multiply(menos_um, m_c, menos_c);

    cv.multiply(d_d0, menos_c, menos_c);
    menos_um.delete();
    d_d0.delete();
    m_c.delete();

    // 3.  Cálculo de 1 - exp(menos_c)
    // Matriz de "uns"
    let um = new cv.Mat.ones(im_h, im_w, cv.CV_64F);

    // Exponencial
    let exponencial = new cv.Mat();
    cv.exp(menos_c, exponencial);
    menos_c.delete()

    // 1 - exponencial
    let um_menos_exp = new cv.Mat();
    cv.subtract(um, exponencial, um_menos_exp);
    exponencial.delete();
    um.delete();

    // 4.  Cálculo de H(u,v)
    let m_gamma_l = new cv.Mat(im_h, im_w, cv.CV_64F, new cv.Scalar(gamma_l));
    let m_gamma_h = new cv.Mat(im_h, im_w, cv.CV_64F, new cv.Scalar(gamma_h));
    let gh_gl = new cv.Mat();

    // gamma_h - gamma_l
    cv.subtract(m_gamma_h, m_gamma_l, gh_gl);

    // m_uv = (um_menos_exp * gh_gl) + gamma_l
    let m_huv = new cv.Mat();
    cv.multiply(gh_gl, um_menos_exp, gh_gl);
    cv.add(gh_gl, m_gamma_l, m_huv);
    m_gamma_l.delete();
    m_gamma_h.delete();
    gh_gl.delete();
    um_menos_exp.delete();
    console.log('GaussModif - m_huv');
    VarParams(m_huv);
    return m_huv;
}

// Função para zero padding
function ZeroPadding(imagem) {
    //Calcula o tamanho ótimo para a FFT
    let im_h = cv.getOptimalDFTSize(imagem.rows);
    let im_w = cv.getOptimalDFTSize(imagem.cols);

    // Matriz de destino para a imagem modificada
    let z_padded = new cv.Mat();

    // Valor escalar representando pixels pretos
    let preto = new cv.Scalar.all(0);

    // Constrói a imagem modificada
    cv.copyMakeBorder(
        imagem, z_padded,
        0, im_h - imagem.rows, 0, im_w - imagem.cols,
        cv.BORDER_CONSTANT, preto
    );

    return z_padded;
}

// Função que retira os pixels extras adicionados por ZeroPadding
function ZeroUnpadding(imagem, padded_imagem) {
    // Dimensões da imagem original
    let im_h = imagem.rows;
    let im_w = imagem.cols;

    let mascara = new cv.Rect(0,0, im_w, im_h);

    return padded_imagem.roi(mascara);

}

//Função para adaptar a matriz da imagem com um formato de matriz complexa(parte real e imaginária com valor 0i)
function PrepareToFFT(padded_imagem){
    let vetor = new cv.MatVector();
    let parte_real = new cv.Mat();
    padded_imagem.convertTo(parte_real, cv.CV_64F);
    let parte_imaginaria = new cv.Mat.zeros(padded_imagem.rows, padded_imagem.cols, cv.CV_64F);
    let complexa = new cv.Mat();
    vetor.push_back(parte_real);
    vetor.push_back(parte_imaginaria);
    cv.merge(vetor, complexa);

    return complexa;
}

//Função que troca os quadrantes das diagonais principal e secundária da imagem
function CrossQuads(imagem){
    let u_c = imagem.rows/2;
    let v_c = imagem.cols/2;

    let r1 = new cv.Rect(0,0, v_c,u_c);
    let r2 = new cv.Rect(v_c,0, v_c,u_c);
    let r3 = new cv.Rect(0,u_c, v_c,u_c);
    let r4 = new cv.Rect(v_c,u_c, v_c,u_c);

    //Pedaços da imagem
    let q1 = imagem.roi(r1);
    let q2 = imagem.roi(r2);
    let q3 = imagem.roi(r3);
    let q4 = imagem.roi(r4);

    //Troca os quadrntes
    let container = new cv.Mat();

    // 1 <-> 4
    q1.copyTo(container);
    q4.copyTo(q1);
    container.copyTo(q4);

    // 2 <-> 3
    q2.copyTo(container);
    q3.copyTo(q2);
    container.copyTo(q3);
}

//Função que calcula a FFT da imagem e retorna a matriz da imagem já com os quadrantes trocados
// pronta para a plotagem.
function MakeFFT(imagem) {
    // Otimiza a imagem para o cálculo da FFT
    let im_otim = ZeroPadding(imagem);

    //Transforma a imagem numa matriz complexa
    let im_compl = PrepareToFFT(im_otim);

    //Calcula a FFT
    let im_fft = new cv.Mat();
    cv.dft(im_compl, im_fft);

    //Separa a parte real e imaginária da matriz complexa
    let componentes = new cv.MatVector();
    cv.split(im_fft, componentes);
    let re = componentes.get(0);
    let im = componentes.get(1);

    // Calcula o espectro
    let espectro = new cv.Mat();
    cv.magnitude(re, im, espectro);

    //Calcula log(1 + magnitude)
    let m1 = new cv.Mat.ones(espectro.rows, espectro.cols, espectro.type());
    let mag = espectro;
    cv.add(mag, m1, mag);
    cv.log(mag, mag);
    mag.convertTo(mag, cv.CV_8U);
    cv.normalize(mag, mag, 255, 0, cv.NORM_MINMAX);

    //Cruza os quadrantes para mostrar
    CrossQuads(mag);
    CrossQuads(im_fft);

    return {'espectro': mag, 'fft' : im_fft}
}

// Função para detectar NaN
function DetectIsNan(imagem){
    console.log('data: ', imagem.ucharAt(0,0));
    console.log('data64F: ', imagem.floatAt(0,0))
}

// Função para retornar parâmetros
function VarParams(v) {
    console.log(v.rows, v.cols, v.channels(), v.type());
    console.log(v);
    console.log(v.ucharAt(0,0));
    console.log(v.ucharAt(0,1));
    console.log(v.doubleAt(0,0));
    console.log(v.doubleAt(0,1));
}

// Função para aplicação do filtro homomórfico propriamente dito
function ApplyHomomorphic(huv, image) {
    // Converte huv em 2 canais
    let v = new cv.MatVector();
    let temp = huv.clone();
    // cv.normalize(temp, temp, 0, 1, cv.NORM_MINMAX);
    CrossQuads(temp);
    v.push_back(temp);
    v.push_back(temp);
    let huv_2c = new cv.Mat();
    cv.merge(v, huv_2c);
    v.delete();
    temp.delete();
    // console.log('huv2c');
    // VarParams(huv_2c);

    // Faz o padding com 0s
    let z_padded = ZeroPadding(image);
    // console.log('zpadded');
    // VarParams(z_padded);

    // Soma 1s à imagem para evitar a indefinição do logaritmo
    let uns = new cv.Mat.ones(z_padded.rows, z_padded.cols, z_padded.type());
    cv.add(z_padded, uns, z_padded);
    uns.delete();
    // console.log('zpadded + 1');
    // VarParams(z_padded);

    // Converte a imagem para float
    z_padded.convertTo(z_padded, cv.CV_64F);
    // console.log('z_padded');
    // VarParams(z_padded);

    // Aplica o logaritmo
    let im_log = new cv.Mat();
    cv.log(z_padded, im_log);
    z_padded.delete();
    // console.log('im_log');
    // VarParams(im_log);

    // Prepara a imagem para a FFT(parte real e imaginária)
    // CrossQuads(im_log);
    let prep_fft = PrepareToFFT(im_log);
    im_log.delete()
    // console.log('prep_fft');
    // VarParams(prep_fft);

    // FFT
    let im_fft = new cv.Mat();
    cv.dft(prep_fft, im_fft, cv.DFT_COMPLEX_OUTPUT);
    // let componentes = new cv.MatVector();
    // cv.split(im_fft, componentes);
    // let fft_re = componentes.get(0);
    // let fft_i = componentes.get(1);
    // componentes.delete();
    // // CrossQuads(im_fft);
    // console.log('fftre');
    // VarParams(fft_re);

    // Faz a filtragem
    // let filt_re = new Array();
    // let filt_im = new Array();
    // let produto = new cv.MatVector();
    // // cv.multiply(im_fft, huv_2c, filtragem);
    // for (let i = 0; i < im_fft.rows; i++) {
    //     for (let j = 0; j < im_fft.cols; j++) {
    //         filt_re.push(fft_re.doubleAt(i, j) * huv.doubleAt(i, j));
    //         filt_im.push(fft_i.doubleAt(i, j) * huv.doubleAt(i, j));
    //     }
    // }
    // let filt_re64 = cv.matFromArray(im_fft.rows, im_fft.cols, cv.CV_64F, filt_re);
    // let filt_im64 = cv.matFromArray(im_fft.rows, im_fft.cols, cv.CV_64F, filt_im);
    // produto.push_back(filt_re64);
    // produto.push_back(filt_im64);
    // let filtragem = new cv.Mat();
    // cv.merge(produto, filtragem);
    // console.log('filtragem');
    // VarParams(filtragem);
    // filt_re64.delete(); filt_im64.delete();
    // produto.delete();
    let filtragem = new cv.Mat();
    cv.multiply(im_fft, huv_2c, filtragem);
    //
    // IFFT
    let im_ifft = new cv.Mat();
    cv.dft(filtragem, im_ifft, cv.DFT_INVERSE|cv.DFT_SCALE);
    console.log('ifft');
    VarParams(im_ifft);

    // Extrai a parte real da IFFT
    let ifft_componentes = new cv.MatVector();
    cv.split(im_ifft, ifft_componentes);
    let ifft_re = ifft_componentes.get(0);
    ifft_componentes.delete();

    // Exponencial
    let im_exp = new cv.Mat();
    cv.exp(ifft_re, im_exp);
    // console.log('im_exp');
    // VarParams(im_exp);
    //
    // Subtrai 1 adicionado na operação do logaritmo
    let uns_64 = new cv.Mat.ones(im_exp.rows, im_exp.cols, im_exp.type());
    cv.subtract(im_exp, uns_64, im_exp);


    // Normaliza entre 0 e 255
    cv.normalize(im_exp, im_exp, 0, 255, cv.NORM_MINMAX);
    console.log('imexp');
    VarParams(im_exp);

    return ZeroUnpadding(image, im_exp);
}

module.exports = {
    MeshgridJS,
    GaussModif,
    ZeroPadding,
    ZeroUnpadding,
    PrepareToFFT,
    CrossQuads,
    MakeFFT,
    ApplyHomomorphic,
    VarParams
}