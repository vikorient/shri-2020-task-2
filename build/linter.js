// Список всех возможных исключений
const errorCodesArray = {
    textSizesShouldBeEqual : {
        code : "WARNING.TEXT_SIZES_SHOULD_BE_EQUAL",
        error : "Тексты в блоке warning должны быть одного размера"
    },
    invalidButtonSize : {
        code : "WARNING.INVALID_BUTTON_SIZE",
        error : "Размер кнопки в блоке warning должны быть на 1 шаг больше эталонного"
    },
    invalidButtonPosition : {
        code : "WARNING.INVALID_BUTTON_POSITION",
        error : "Блок кнопки в блоке warning не может находиться перед блоком placeholder"
    },
    invalidPlaceholderSize : {
        code : "WARNING.INVALID_PLACEHOLDER_SIZE",
        error : "Допустимые размеры для блока placeholder в блоке warning : s, m, l"
    },
    severalH1 : {
        code : "TEXT.SEVERAL_H1",
        error : "Заголовок первого уровня на странице должен быть единственным"
    },
    invalidH2Position : {
        code : "TEXT.INVALID_H2_POSITION",
        error : "Заголовок второго уровня не может находиться перед заголовком первого уровня"
    },
    invalidH3Position : {
        code : "TEXT.INVALID_H3_POSITION",
        error : "Заголовок третьего уровня не может находиться перед заголовком второго уровня"
    },
    tooMuchMarketingBlocks : {
        code : "TEXT.INVALID_H3_POSITION",
        error : "Заголовок третьего уровня не может находиться перед заголовком второго уровня"
    }                                       
}

// Список возможных размеров
const text_sizes = ['xxxs','xxs','xs','s','m','l','xl','xxl','xxxl','xxxxl'];

// Ф-ция проверки блока warning
function warningCheck(content) {
    let text_num = 0;
    let placeholder_num = 0;
    let button_num = 0;
    let text_size = '';
    let text_size_pos = 0;
    let error = [];
    for (let i=0; i<content.length; i++) {
        if (content[i]["block"]=='text')
        {
            if (text_num==0)
            {
                text_size = content[i]["mods"]["size"];
                text_size_pos = text_sizes.indexOf(text_size);
            }
            else
            {
                if (content[i]["mods"]["size"]!=text_size) 
                {
                    error.push(errorCodesArray.textSizesShouldBeEqual);
                }
            }
            text_num++;
        }

        if (content[i]["block"]=='button')
        {
            button_size = content[i]["mods"]["size"];
            button_size_pos = text_sizes.indexOf(button_size);
            if (button_size_pos!=text_size_pos+1)
            {
                error.push(errorCodesArray.invalidButtonSize);
            }
            button_num++;
        }

        if (content[i]["block"]=='placeholder')
        {
            placeholder_size = content[i]["mods"]["size"];
            if (button_num!=0 && placeholder_num==0)
            {
                error.push(errorCodesArray.invalidButtonPosition);
            }

            if (text_sizes.indexOf(placeholder_size)<3 || text_sizes.indexOf(placeholder_size)>5)
            {
                error.push(errorCodesArray.invalidPlaceholderSize);
            }
            placeholder_num++;
        }
    }
    return error;
}

// Ф-ция проверки блока text
function textCheck(content) {
    let h1_text_num = 0;
    let h2_text_num = 0;
    let h3_text_num = 0;
    let error = [];
    for (let i=0; i<content.length; i++) {
        if (content[i]["mods"]["type"]=='h1')
        {
            if (h1_text_num!=0)
            {
                error.push(errorCodesArray.severalH1);
            }
            h1_text_num++;
        }

        if (content[i]["mods"]["type"]=='h2')
        {
            if (h2_text_num!=0 && h1_text_num==0)
            {
                error.push(errorCodesArray.invalidH2Position);
            }
            h2_text_num++;
        }

        if (content[i]["mods"]["type"]=='h3')
        {
            if (h3_text_num!=0 && h2_text_num==0)
            {
                error.push(errorCodesArray.invalidH3Position);
            }
            h3_text_num++;
        }
    }
    return error;
}

// Ф-ция проверки блока grid
function gridCheck(content) {
    let error = [];
    for (let i=0; i<content.length; i++) {
        let block_name = content[i]["content"][0]["block"]
        if (block_name=="commercial" || block_name=="offer")
        {
            if (content[i]["elemMods"]["m-col"]>2)
            {
                error.push(errorCodesArray.tooMuchMarketingBlocks);
            }
        }
    }
    return error;
}

function lint(string) {

    array = JSON.parse(string);

    if (array.block == "warning")
    {
        error = warningCheck(array.content);
    }
    else if (array.block == "text")
    {
        error = textCheck(array.content);
    }
    else if (array.block == "grid")
    {
        error = gridCheck(array.content);
    }

    return JSON.stringify(error);
}