var datos = {};

$(document).ready(function()
{
	listaFicheros();
	// CREA CONF DE API NUEVA
	$('#crear').click(function()
		{
			datos = undefined;
			datos = {
				"generales": {
					"uri": "",
					"txtID": ""
				},
				"especificas": {}
			}
			$("#gnrl").empty();
			$("#espc").empty();
			$("#cajaAPI").addClass("toHide");
			$('#btnFind').addClass('toHide');
			$("h4").text("");
			pintarForm(datos);
		});
	// LLAMA Y EDITA CONF DE API
	$("#editar").click(function()
		{
			$("#cajaAPI").toggle().focus().keyup(function()
				{
					if($('#cajaAPI').val().length > 0)
					{
						$('#btnFind').removeAttr('disabled');
					}
					else
					{
						$('#btnFind').attr('disabled','true');
					}
				});
			$('#btnFind').toggle().click(function()
			{
				var nomAPI = $.trim($("#cajaAPI").val());
				if(nomAPI)
				{
					$.getJSON('/datos?name=' + nomAPI, function(datosIn)
					{
						if(datosIn.error)
						{
							alert('No se encuentra la configuración.\nRevise el nombre');
						}
						else
						{
							datos = datosIn;
							pintarForm(datos);
							$("#cajaAPI").toggle();
							$('#btnFind').toggle();
						}
					});
				}
			});
		});
	// GUARDA LA CONF DE API
	$('#guardar').click(function()
		{
			var uri = datos.generales.uri;
			var txt = datos.generales.txtID;
			if(uri.length > 0 && txt.length > 0)
			{
				var cadena = JSON.stringify(datos);
				$.ajax(
				{
				  method: "POST",
				  url: "/get",
				  data: {datos: cadena}
				})
				.fail(function()
				{
					alert('Se ha producido un error en la escritura :-(');
				})
				.done(function( mensaje ) 
				{
				    alert("Guardado: " + mensaje);
				    listaFicheros();
				});
			}
			else
			{
				alert("Los campos de 'uri' y 'txtID', son necesarios para guardar.");
			}
		});
	// AGREGA UN NUEVO GRUPO A LAS CONF ESPECIFICAS
	$('#masGroup').click(function()
		{
			$('#newGroup').toggle(); // removeClass('toHide');
		});
	$('#newGroupName').keyup(function()
		{
			if($('#newGroupName').val().length > 0)
			{
				$('#btnNewGroup').removeAttr('disabled');
			}
			else
			{
				$('#btnNewGroup').attr('disabled','true');
			}
		});
	$('#btnNewGroup').click(function()
		{
			var name = $('#newGroupName').val();
			datos.especificas[name] = {};
			$('#newGroupName').val(undefined);
			$('#newGroup').toggle();
			pintarForm(datos);
		});
});

function pintarForm(datos)
{
	// PINTA NOMBRE DEL API
	$('h4').text((datos.generales.txtID).toUpperCase());
	$('#gnrl').empty();
	$('#espc').empty();
	// PINTA CONF GENERALES
	for(var keyGnrl in datos.generales)
	{
		var _group = $('<div></div>').addClass('form-group');
		var _name = $('<input></input>').attr({'type':'text','size':'15','disabled':'true'}).val(keyGnrl);
		var _value = $('<input></input>').attr({'type':'text', 'size':'40', 'required':'true', 'onblur':"gnrlEditada(this,'" + keyGnrl + "');"}).val(datos.generales[keyGnrl]);
		_group.append(_name,'&nbsp;', _value);
		$('#gnrl').append(_group);
	}

	// PINTA CONF ESPECIFICAS
	for(var keyGroup in datos.especificas)
	{
		// PINTA GRUPO
		var _divGroup = $('<div></div>').attr({'name': keyGroup, 'class':'well well-sm'});
		var _nameGroup = $('<input></input>').attr({'type':'text','size':'15','dislabed':'true'}).val(keyGroup);
		var _spanGroup = $('<span></span>').addClass('glyphicon glyphicon-remove').text(' ');
		var _btnGroup = $('<button></button').attr('type','button').addClass('btn btn-danger btn-xs').append(_spanGroup).click(function()
			{
				var aux = $(this).prev().val();
				delete datos.especificas[aux];
				pintarForm(datos);
			});
		var _cotenedor = $('<span></span>').addClass('toHide');
		// GENERA LAS CAJAS PARA LOS NUEVOS ATRIBUTOS DEL GRUPO
		var _spanNewGroup = $('<span></span>').addClass('glyphicon glyphicon-plus').text(' ');
		var _btnNewGroup = $('<button></button>').attr('type','button').addClass('btn btn-primary btn-sm').append(_spanNewGroup).click(function()
			{
				$(this).nextAll('span').empty().toggle(); 
				var _nombre = $('<input></input>').attr({'type':'text','size':'15','placeholder':'nombre'}).keyup(function()
					{
						if($(this).val().length > 0)
						{
							$(this).nextAll('button').removeAttr('disabled');
						}
						else
						{
							$(this).nextAll('button').attr('disabled','true');
						}
					});
				var _valor = $('<input></input>').attr({'type':'text','placeholder':'valor'});
				// AGREGA ATRIBUTOS (NOMBRE, VALOR) AL GRUPO
				var _spanBtn = $('<span></span>').addClass('glyphicon glyphicon-ok').text(' ');
				var _btn = $('<button></button>').attr({'type':'button','disabled':'true'}).addClass('btn btn-success btn-sm').append(_spanBtn).click(function()
					{
						// LISTA CON VALORES DE LOS INPUTS
						var lista = $(this).prevAll('input');
						// BUSCA EL NOMBRE DEL GRUPO AL QUE AGREGAR LOS VALORES NUEVOS
						var pater = $(this).parent().prevAll('input').val();
						datos.especificas[pater][$(lista[1]).val()] = $(lista[0]).val();
						$(this).parent().empty();
						pintarForm(datos);
					});
				$(this).next().append('&nbsp;&nbsp;',_nombre, _valor, _btn);
			});
		
		_divGroup.append(_nameGroup,'&nbsp;', _btnGroup,'&nbsp;&nbsp;',_btnNewGroup, _cotenedor,'<br><br>');
		// PINTA ELEMENTOS
		for(var key in datos.especificas[keyGroup])
		{
			var _div = $('<div></div>').attr({'name':key,'size':'40'}).addClass('form-group');
			var _name = $('<input></input>').attr({'type':'text','size':'15'}).val(key);
			var _val = $('<input></input>').attr('type','text').val(datos.especificas[keyGroup][key]);
			// BOTON QUE ELIMINA EL ATRIBUTO
			var _span = $('<span></span>').addClass('glyphicon glyphicon-remove').text(' ');
			var _btn = $('<button></button>').attr({'type':'button', 'onclick':"eliminar(this,'" + keyGroup + "','" + key + "');"}).addClass('btn btn-danger btn-xs').append(_span);
			_div.append(_name, '&nbsp;', _val, '&nbsp;', _btn);
			_divGroup.append(_div);
		}
		$('#espc').append(_divGroup);
	}
	$('#myForm').removeClass('toHide');
	console.log(JSON.stringify(datos));
}

function eliminar(elemento, keyGroup, key)
{
	$(elemento).parent().remove();
	delete datos.especificas[keyGroup][key];
	pintarForm(datos);
}

function gnrlEditada(elemento, keyGnrl)
{
	datos.generales[keyGnrl] = $(elemento).val();
	pintarForm(datos);
}

function listaFicheros()
{
	$.getJSON('/dir',function(lista)
		{
			console.log('lista: ' + JSON.stringify(lista));
			var strLista = 'ficheros guardados:';
			if(lista.error)
			{
				// HACER ALGOR
			}
			else
			{
				for(var i = 0; i < lista.length; i++)
				{
					var aux = lista[i].slice(0,-5);
					i === 0? (strLista += ' ' + aux) : (strLista += ', ' + aux);
				}
				$('#listaDir').empty();
				$('#listaDir').append('<small>' + strLista + '</small>');
			}
		});
}