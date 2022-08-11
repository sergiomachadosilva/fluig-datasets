function createDataset(fields, constraints, sortFields) {

    var dataset = DatasetBuilder.newDataset();

    dataset.addColumn("STATUS");

    try {

        var nomeRemetente = String(obterParametro(constraints, "nomeRemetente"));
        var assunto = String(obterParametro(constraints, "assunto"));
        var conteudo = String(obterParametro(constraints, "conteudo"));
        var textoPlano = String(obterParametro(constraints, "textoPlano")) == "true";
        var destinatario = String(obterParametro(constraints, "destinatario"));
        var responderPara = String(obterParametro(constraints, "responderPara"));
        var copia = obterParametro(constraints, "copia") ? JSON.parse(obterParametro(constraints, "copia")) : [];
        var copiaOculta = obterParametro(constraints, "copiaOculta") ? JSON.parse(obterParametro(constraints, "copiaOculta")) : [];
        var anexos = obterParametro(constraints, "anexos") ? JSON.parse(obterParametro(constraints, "anexos")) : [];


        if ((!nomeRemetente) || (nomeRemetente == "null")) {
            throw "Nome do remetente não informado";
        }

        if ((!assunto) || (assunto == "null")) {
            throw "Assunto não informado";
        }

        if ((!conteudo) || (conteudo == "null")) {
            throw "Conteúdo do corpo do e-mail não informado";
        }

        if (!validarEmail(destinatario)) {
            throw "E-mail do destinatário inválido ou não informado";
        }

        if ((responderPara) && (!validarEmail(responderPara))) {
            throw "E-mail de ReplyTo é inválido";
        }

        for (var i = 0; i < copia.length; i++) {
            if (!validarEmail(copia[i])) {
                throw "O e-mail " + copia[i] + " é inválido";
            }
        }

        for (var i = 0; i < copiaOculta.length; i++) {
            if (!validarEmail(copiaOculta[i])) {
                throw "O e-mail " + copiaOculta[i] + " é inválido";
            }
        }

        try {

            enviarEmail(nomeRemetente, assunto, conteudo, textoPlano, destinatario, responderPara, copia, copiaOculta, anexos);
            dataset.addRow(new Array("OK"));

        } catch (err) {
            throw err.toString();
        }

    } catch (err) {
        dataset.addRow(new Array("dsEnviarEmailComAnexos => function " + arguments.callee.name + " => " + err.toString()));
    }

    return dataset;
}


/**
 * Função para enviar email com Anexos
 * @param {string} nomeRemetente Parâmetro obrigatório, Nome do remetente
 * @param {string} assunto Parâmetro obrigatório, Assunto do e-mail
 * @param {string} conteudo Parâmetro obrigatório, Corpo do e-mail escrito em HTML ou texto plano
 * @param {?boolean} textoPlano Parâmetro opcional, Se verdadeiro, indica que o corpo do e-mail será enviado como texto plano
 * @param {string} destinatario Parâmetro obrigatório, E-mail do destinatário principal
 * @param {?string} responderPara Parâmetro opcional, E-mail que será configurado como ReplyTo
 * @param {?string[]} copia Parâmetro opcional, Array de string com os e-mails que serão enviados como cópia
 * @param {?string[]} copiaOculta Parâmetro opcional, Array de string com os e-mails que serão enviados como cópias ocultas
 * @param {?object[]} anexos Parâmetro opcional, Array de objetos com informações dos anexos a serem enviados no e-mail
 * @return {void}
 */
function enviarEmail(nomeRemetente, assunto, conteudo, textoPlano, destinatario, responderPara, copia, copiaOculta, anexos) {

    try {

        // Altere as informações abaixo de acordo com seu servidor de e-mails
        var emailRemetente = "E-MAIL";
        var senha = "SUA_SENHA";
        var servidor = "SERVIDOR_DE_EMAIL";
        var porta = "PORTA";

        // Indica se o formato de texto será texto ou html
        var formatConteudo = textoPlano ? "text/plain" : "text/html";
        var replyTo = responderPara ? responderPara : emailRemetente;

        //Cria as propriedades necessarias para o envio de email
        var props = new java.util.Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.host", servidor);
        props.put("mail.smtp.port", porta);
        //props.put("mail.debug", "true");

        // Cria a sessao passando as propriedades
        var session = javax.mail.Session.getInstance(props);
        var message = new javax.mail.internet.MimeMessage(session);

        // Cria o objeto que recebe o texto do corpo do e-mail
        var messageBodyPart = new javax.mail.internet.MimeBodyPart();
        var multipart = new javax.mail.internet.MimeMultipart("mixed");

        // Objeto encarregado de enviar os dados para o email
        var transport = session.getTransport();

        // Define o e-mail e nome do remetente
        message.setFrom(new javax.mail.internet.InternetAddress(emailRemetente, nomeRemetente));
        message.setReplyTo(new javax.mail.internet.InternetAddress.parse(replyTo, false));

        // Seta o assunto do e-mail e sua codificação
        message.setSubject(assunto, "UTF-8");

        // Adiciona o destinatário principal
        message.addRecipient(
            javax.mail.Message.RecipientType.TO,
            new javax.mail.internet.InternetAddress(destinatario)
        );


        // Seta os destinatários que receberão uma cópia do e-mail
        if (copia && copia.length) {
            for (var i in copia) {
                message.addRecipient(
                    javax.mail.Message.RecipientType.CC,
                    new javax.mail.internet.InternetAddress(copia[i])
                );
            }
        }

        // Seta os destinatários que receberão uma cópia oculta
        if (copiaOculta && copiaOculta.length) {
            for (var j in copiaOculta) {
                message.addRecipient(
                    javax.mail.Message.RecipientType.BCC,
                    new javax.mail.internet.InternetAddress(copiaOculta[j])
                );
            }
        }

        // Seta o conteúdo do corpo do e-mail e sua codificação
        messageBodyPart.setContent(conteudo, (formatConteudo + "; charset=utf-8"));

        // Adiciona os anexos que serão enviados no e-mail
        for (var i = 0; i < anexos.length; i++) {
            var anexo = anexos[i];
            adicionaAnexo(multipart, anexo.id, anexo.versao, anexo.nomeArquivo, anexo.descArquivo);
        }


        multipart.addBodyPart(messageBodyPart);
        message.setContent(multipart);

        try {

            // Método para se autenticar ao servidor
            transport.connect(servidor, emailRemetente, senha);

            // Método para enviar a mensagem criada
            transport.sendMessage(message, message.getAllRecipients());

        } catch (err) {
            throw err.toString();
        }
        finally {
            transport.close();
        }

    } catch (err) {
        throw ("function " + arguments.callee.name + " => " + err.toString());
    }
}

/**
 * Adiciona anexos no email que será disparado. Esta função ler os arquivos a partir do volume padrão do Fluig
 * @param {object} multipart Parâmetro obrigatório
 * @param {Number|string} id Parâmetro obrigatório, Id do arquivo que está no GED
 * @param {Number|string} versao Parâmetro obrigatório, Versão do arquivo que está no GED
 * @param {string} nomeArquivo Parâmetro obrigatório, Nome do arquivo com a extensão que esta armazenado no GED
 * @param {?string} descArquivo Parâmetro opcional, Nome do arquivo com a extensão que aparecerá no email. 
 * Caso não informado o valor padrão será nomeArquivo  
 * @return {void} 
 * @author Sérgio Machado
 */
function adicionaAnexo(multipart, id, versao, nomeArquivo, descArquivo) {
    try {

        var dirDefault = fluigAPI.getTenantService().getTenantData(["dirDefault"]).get("dirDefault");
        var arquivo = new java.io.File(dirDefault + "\\public\\" + id + "\\" + versao + "\\" + nomeArquivo);

        var attachment = new javax.mail.internet.MimeBodyPart();
        attachment.setDataHandler(new javax.activation.DataHandler(new javax.activation.FileDataSource(arquivo)));
        attachment.setDisposition(javax.mail.internet.MimeBodyPart.ATTACHMENT);
        attachment.setFileName(descArquivo ? descArquivo : nomeArquivo);
        multipart.addBodyPart(attachment);

    } catch (err) {
        throw ("function " + arguments.callee.name + " => " + err.toString());
    }
}


/**
 * Verifica se um endereço de e-mail é válido
 * @param {string} email Parâmetro obrigatório, endereço de email
 * @return {boolean} Retorna verdadeiro coso o e-mail seja válido, caso contrário, retorna falso
 * @author Sérgio Machado
 */
function validarEmail(email) {
    var er = new RegExp(/^[A-Za-z0-9_\-\.]+@[A-Za-z0-9_\-\.]{2,}\.[A-Za-z0-9]{2,}(\.[A-Za-z0-9])?/);
    if (email == '' || !er.test(email)) {
        return false;
    } else {
        return true
    }
}


/**
 * Retorna o valor initialValue de uma determinada constraint
 * @param {object} constraints Parâmetro obrigatório, constraints recebidas no dataset
 * @param {string} campo Parâmetro obrigatório, constraint que deseja obter o valor
 * @return {string} 
 */
function obterParametro(constraints, campo) {
    var valor = "";
    if ((constraints != null) && (constraints.length > 0)) {
        for (i in constraints) {
            var constraint = constraints[i]
            if (constraint.getFieldName().trim().toUpperCase() == campo.trim().toUpperCase()) {
                valor = constraint.getInitialValue();
                break;
            }
        }
    }
    return valor;
}