// on met un "0" devant un nombre < 10
function checkTime(nombre) 
{
	if(nombre < 10) 
	{
		nombre = "0" + nombre;
	}
	return nombre;
}

// fonction pour faire écouler le temps de l'horloge sans arrêt
function startTime() 
{
	var today = new Date();
	var heure = today.getHours();
	var minute = today.getMinutes();
	var seconde = today.getSeconds();
	// rajoute un zero devant les nombres < 10
	heure = checkTime(heure);
	minute = checkTime(minute);
	seconde = checkTime(seconde);

	document.getElementById('current_time').innerHTML = heure + ":" + minute + ":" + seconde;
	
	var id_timeout = setTimeout(function() {
		startTime() // appel récursif
	}, 1000); // 1000ms
}

// verifie continuellement l'heure actuelle avec l'horaire de l'alarme
function checkTimerAlert(heuresAlarme, minutesAlarme, messageAlarme)
{
	// horaire actuel
	var today = new Date();
	var heure = today.getHours();
	var minute = today.getMinutes();
	var seconde = today.getSeconds();

	if((heuresAlarme == heure) && (minutesAlarme == minute) && (seconde == "0"))
	{
		// parametres audio
		var sound_alert = document.createElement('audio');
		sound_alert.autoplay = 'autoplay';
		sound_alert.src = 'notification_sound.mp3';
		sound_alert.type = 'audio/mpeg';
		document.getElementById('alarme_list').appendChild(sound_alert);
		window.alert("ATTENTION!\nMessage alarme: " + messageAlarme);
	}
	
	var id_timeout = setTimeout(function() {
		checkTimerAlert(heuresAlarme, minutesAlarme, messageAlarme) // appel récursif
	}, 1000); // 1s
}

// fonction d'activation pour chaque nouveau bouton de suppression créé
function activation_delete_button()
{
	var liste_boutons = document.getElementsByClassName('button_delete');
	for(var i=0; i<liste_boutons.length; i++)
	{
		liste_boutons[i].addEventListener('click', function(e) {
			var current_alarm = document.getElementById(e.target.parentNode.id);
			if(current_alarm.id != 'alarme0') // on garde le 1er alarme comme référence
			{
				current_alarm.remove();
			}
		});
	}
}

// confirme l'horaire de l'alarme
function modificationAlarme()
{
	var list_checkboxes = document.getElementsByClassName("checkboxe");
	for(var i=0; i<list_checkboxes.length; i++)
	{
		list_checkboxes[i].addEventListener('change', function() {
			var div_parent = document.getElementById(this.parentNode.id);
			if(div_parent.children[0].checked == true) // verifie si la checkbox d'une alarme est cochée ou pas
			{
				var heures = div_parent.children[1].value;
				var minutes = div_parent.children[2].value;
				var message = div_parent.children[3].value;
				div_parent.children[1].disabled = true; // heures
				div_parent.children[2].disabled = true; // minutes
				div_parent.children[3].disabled = true; // message
				div_parent.children[4].disabled = true; // liste sons alarme
				checkTimerAlert(heures, minutes, message);
			}
			else
			{
				for(var j=1; j<=4; j++) // réactive les champs désactivés
				{
					div_parent.children[j].disabled = false;
				}
				checkTimerAlert(null, null, null); // annule l'alarme	
			}
		});
	}
}

// Listener pour l'ajout d'alarmes
var id_alarm = 1;
document.getElementById('add_alarm').addEventListener('click', function() {
	var current_alarm = document.getElementById('alarme0');
	var duplicate_alarm = current_alarm.cloneNode(true);
	duplicate_alarm.id = "alarme" + id_alarm; // chaque div clonée a une ID différente
	id_alarm++;
	document.getElementById('alarme_list').appendChild(duplicate_alarm); // rajoute la div clonée dans la section

	activation_delete_button(); // activation des nouveaux boutons de suppression
	modificationAlarme();  
});

startTime();