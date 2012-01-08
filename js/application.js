	var CANVAS_WIDTH = window.innerWidth, // faire widthcanvas ?
	    CANVAS_HEIGHT = window.innerHeight, //idem ?
	    BRUSH_SIZE = 2.5,
	    BRUSH_PRESSURE = 1,
	    COLOR = [255, 255, 255],
	    BACKGROUND_COLOR = [0, 0, 0],
	    brush,
	    canvasToile,
	    ctxT;

$(function () {
	
		var oldX, oldY, oldZ;
		
		var modeEcriture = true;
			var clickAllow = true;


		var canvasPos, ctxP; //make it global
	
		var panneauActif = "splash_accueil";
		var time = 3;
		
		$('#commencerDessin.kinectOk').live('click', function(event) {
			$('#splash_accueil').fadeOut(750, function() {

				
				ecrireTimer(time);
				
				var timer = window.setInterval(function() {
					clearCanvas(ctxP, canvasPos);
					if(time == 0) {
						ctxP.font = "36pt Calibri,Geneva,Arial";
						ctxP.fillStyle = "rgb(255,255,255)";
						ctxP.fillText("Dessinez !", 320, 80);
						window.setTimeout(function() {
							clearInterval(timer);
							clearCanvas(ctxP, canvasPos);
							panneauActif = "toile";
						}, 1000)
					} else {
						ecrireTimer(time);
					}
				}, 1000);
			});
			
			event.preventDefault();
		});
		
		function ecrireTimer(tps) {
					ctxP.font = "36pt Calibri,Geneva,Arial";
					ctxP.fillStyle = "rgb(255,255,255)";
					ctxP.fillText("Reculez et attendez pour dessiner", 80, 80);
					ctxP.font = "60pt Calibri,Geneva,Arial";
					ctxP.fillText(tps, 360, 200);
					time--;
				}
		
		DepthJS = {
			onKinectInit: function() {
				$('#commencerDessin').addClass('kinectOk');
				$('#commencerDessin + span').text('');
			},
			onRegister: function(x, y, z, data) {
				ctxP.beginPath();
				ctxT.beginPath();
				if(oldX) {
					ctxT.moveTo(oldX, oldY);
				}
			},
			onUnregister: function() {
				ctxP.closePath();
				ctxT.closePath();
			
				// Éffacer le curseur
				modeEcriture = false;
				brush.strokeEnd();
				clearCanvas(ctxP, canvasPos);
			
				// Ne plus se souvenir du dernier point (pour définir une nouvelle orgine par la suite)
				oldX = oldY = oldZ = undefined;
			},
			onMove: function(x, y, z) {
		
				// Mettre les données reçues de Kinect à l'échelle du canvas
				x = 8 * (100 - x);
				y = 6 * y;
			
				if(panneauActif == "toile" || panneauActif == "configuration") {
					dessinerCurseur(x,y);
				}
			
			
				var nouveauTrace;
				if(oldX && modeEcriture && panneauActif == "toile") { // Si il y a eu un point avant... && si en mode écriture && on est sur la toile
					brush.stroke( x, y );
				} else {
					nouveauTrace = true;
				}

				oldX = x; oldY = y; oldZ=z;
				if(nouveauTrace) {
					brush.strokeStart( x, y );
				}
			},
			onSwipeLeft: function() {
				if(panneauActif == "toile") {
					
				}
				else if(panneauActif == "configuration") {
					fermerConfiguration();
				}
			},
			onSwipeRight: function() {
				ouvrirConfiguration();
			},
			onHandClick: function(x, y, z) {
				if(clickAllow == true) {
				
					var reAllowClick = true;
					clickAllow = false;
				
					if(panneauActif == "toile") {
						if(modeEcriture == true) {
							modeEcriture = false;
							brush.strokeEnd();
						}
						else if (modeEcriture == false){
							modeEcriture = true;
						}
					} // fin des actions sur la toile
					else if (panneauActif == "configuration") {
						$('.colorSelector.hover').bind("click", function(event) {
							COLOR = eval($(this).attr('data-color'));
							$('#colorPreview').css({'background-color':COLOR});
							event.preventDefault();
						}).trigger("click");
						$('#savePng.hover').bind("click", function(event) {
							clearCanvas(ctxP, canvasPos);
							$(this).removeClass('hover');
							$('#popUpBackground, #form-finalisation').show();
							panneauActif="popup";
							
							$('#form-finalisation').submit(function(event){
								var canvasData = canvasToile.toDataURL("image/png");
								var $pseudo = $('#pseudo');
								var $nomCreation = $('#nom-creation');
									$('#form-finalisation input').removeClass('must-fill-in');
								
								var pseudo = $pseudo.val();
								var nomCreation = $nomCreation.val();
								var error = 0;
								
								if (pseudo == '') {
									$pseudo.addClass('must-fill-in');
									error++;;
								}
								if (nomCreation == '') {
									$nomCreation.addClass('must-fill-in');
									error++;
								}
								
								if(error==0) {
									$.ajax({
										type:"POST",
										url:'testSave.php',
										data:{'canvasData':canvasData, 'pseudo':pseudo, 'nomCreation':nomCreation },
										dataType:'text'
									})
									.success(function(data) {
										clearCanvas(ctxP, canvasPos);
										console.log("data : ");
										console.log(data);
										/*$('#canvasSliderContent').append('<img src="img/creations/'+data.url+'.png" class="floatLeft">')
											.animate({
												'left':'-1600px'
											}, 500, function(){
												panneauActif="termine";
											});*/
									});
								}
								event.preventDefault();
							});
							event.preventDefault();
						}).trigger('click')
					}	

					if (reAllowClick) { window.setTimeout(allowClick, 500); }
				} // des actions seuemnt si le clic est autorisé (évite de récupérer plusieurs clics en même temps)

			} // onHandClick
		};
	
		canvasPos = document.getElementById('posKinect');
		ctxP = canvasPos.getContext('2d');

		init(); // init des fonctions de tracé via Harmony
	
		function init()
		{
			canvasToile = document.getElementById('toile');
			ctxT = canvasToile.getContext("2d");
		
			//$('#toile').css({'background-color':"rgb(" + BACKGROUND_COLOR[0] + ", " + BACKGROUND_COLOR[1] + ", " + BACKGROUND_COLOR[2] + ")"});
		
			ctxT.fillStyle = "rgb(" + BACKGROUND_COLOR[0] + ", " + BACKGROUND_COLOR[1] + ", " + BACKGROUND_COLOR[2] + ")";
			ctxT.fillRect(0,0,canvasToile.width, canvasToile.height);

			brush = new ribbon(ctxT);

		}

		function allowClick() {
			clickAllow = true;
		}
	
		function ouvrirConfiguration() {
			if(panneauActif == "toile") {
				panneauActif = "";
				$('#canvasSliderContent').animate({left:0}, 750, function() {
					panneauActif = "configuration";
				})
			}
		}
	
		function fermerConfiguration() {
			if(panneauActif == "configuration") {
				panneauActif = "";
				$('#canvasSliderContent').animate({left:'-800px'}, 750, function() {
					panneauActif = "toile";
				})
			}
		}
	
		function clearCanvas(context, canvas) {
		  context.clearRect(0, 0, canvas.width, canvas.height);
		  var w = canvas.width;
		  canvas.width = 1;
		  canvas.width = w;
		}
	
		function dessinerCurseur(x,y) {
			clearCanvas(ctxP, canvasPos);
			ctxP.lineWidth = 3;
			ctxP.strokeStyle = "#00b4ff";
	
			if(panneauActif == "toile") {
				if(modeEcriture) {
					ctxP.moveTo(x-10,y);
					ctxP.lineTo(x+10,y);
					ctxP.moveTo(x,y-10);
					ctxP.lineTo(x,y+10);
				} else {
					ctxP.moveTo(x+10,y);
					ctxP.arc(x, y, 10, 0, Math.PI*2, true);
				}
			}
			else if(panneauActif == "configuration") {
				ctxP.moveTo(x+10,y);
				ctxP.arc(x, y, 10, 0, Math.PI*2, true);
			
				// Récupérer la position de la souris et voi si on est au dessus d'un élément
				$('#configuration').children('a').each(function() {
					$this = $(this);
					$this.removeClass('hover');
					$position = $this.position();
					if( x >= $position.left && x <= $position.left+$this.width() && y >= $position.top && y <= $position.top+$this.height() ) {
						$this.addClass('hover');
					}
				});
			}
			ctxP.stroke();
		} // fin de la fonction dessinerCurseur()
	
		$('.colorSelector').click(function(event) {
			COLOR = $(this).css('background-color');
			$('#cadreCouleurActuelle').css({'background-color':COLOR});
			event.preventDefault();
		});
		
		$("#popUpBackground").live('click', closePopUp);
		$("#form-finalisation > a").live('click', closePopUp);
		
		function closePopUp() {
			$('.popUp:visible').hide();
			$('#popUpBackground').hide();
			panneauActif ="configuration"
		}

});