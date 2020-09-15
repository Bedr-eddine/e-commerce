window.onload= function () {

//recuperer les données du fichier json
let result = new XMLHttpRequest();
result.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
        let data = JSON.parse(this.response).telephones;
        
        //afficher les articles dans la page html
        for(let i=0; i<data.length;i++){
            //div contenant chaque article
            let myDiv =  document.createElement('div');
            myDiv.classList.add("productContainer");
            //creer le nom du produit
            let myTitle = document.createElement('h2');
            myTitle.classList.add('centre');
            myTitle.innerText = data[i].modele;
            //ajouter le div contenant chaque produit comme enfant du main
            document.querySelector(".monFlex").appendChild(myDiv);
            //ajouter le titre comme enfant du div contenant chaque article
            myDiv.appendChild(myTitle);
            //creer l'image du produit
            let myImg = document.createElement('img');
            myImg.setAttribute("src", "img/"+data[i].img);
            //creer une div pour contenir l'image
            let myImgDiv = document.createElement('div');
            myImgDiv.classList.add('imgContainer');
            //mettre l'image dans sa div
            myImgDiv.appendChild(myImg);
            //mettre la div de l'image dans la div de l'article
            myDiv.appendChild(myImgDiv);
            //Creer le prix
            let myPrix = document.createElement('h3');
            myPrix.innerText = data[i].prix+" €";
            myPrix.classList.add('centre');
            //attacher le prix a la div de l'article
            myDiv.appendChild(myPrix);
            //creer le boutton ajouter au panier
            let bouton = document.createElement('button');
            bouton.innerText = "Ajouter au panier";
            bouton.classList.add('myButton');
            //ajouter le bouton a la div de l'article
            myDiv.appendChild(bouton);
            
            //Ajout des articles au panier
            document.querySelectorAll('.myButton')[i].addEventListener("click", ()=>{
                ajout(i);
                //et on désactive ce boutton
                document.querySelectorAll('.myButton')[i].setAttribute("disabled", "");
                total();
            })
         }

         //fonction d'ajout au panier

        let ajout = (index)=>{
            
            localStorage.setItem(index, index);
            localStorage.setItem('nom'+index, data[index].modele);
            localStorage.setItem('prix'+index, data[index].prix);
            localStorage.setItem('img'+index, data[index].img);
            
            //fonction pour diminuer la qte d'articles
            let articleMoins = ()=>{
            let quant = Number(document.getElementById('a'+index).innerText);
            if(quant>1){
            document.getElementById('a'+index).innerText= quant-1;
            //modifier le prix affiché en fonction de la quantitée
            prixLigne = (localStorage.getItem('prix'+index)*(quant-1)).toFixed(2);
            monPrix.innerHTML = "<p> Prix: <span class='prix' id='prix"+localStorage.getItem(index)+"'>" + prixLigne +"</span> €"+"</p>" ;
        }
        
        };
        //fonction pour incrementer qté article
        let articlePlus = ()=>{
            let prixLigne;
            let quant = Number(document.getElementById('a'+localStorage.getItem(index)).innerText);
            document.getElementById('a'+localStorage.getItem(index)).innerText= quant+1;
            //modifier le prix affiché en fonction de la quantitée
            prixLigne = (data[index].prix*(quant+1)).toFixed(2);
            monPrix.innerHTML = "<p> Prix: <span class='prix' id='prix"+localStorage.getItem(index)+"'>" + prixLigne +"</span> €"+"</p>";
        }
        //fonction pour supprimer la ligne d'un article
        let supLigne = ()=>{
            let conf = confirm('Voulez-vous vraiment supprimer?');
            if(conf){
                //déduire la somme de cette ligne du total
            document.getElementById('prix-global').innerText = Number(document.getElementById('prix-global').innerText)- Number(document.getElementById('prix'+localStorage.getItem(index)).innerText);
            myPanier.removeChild(document.getElementById(localStorage.getItem(index)));
            //reactiver le bouton d'ajout de cet article
            document.querySelectorAll('.myButton')[localStorage.getItem(index)].removeAttribute("disabled");
            //reactualiser le prix total pour l'offre promotionnelle
            maPromo();
        
            }
                
        }
       
            //creation du panier
            //creation de la div qui contient chaque ligne de produit
            let myPanier = document.querySelector('.panier');
            let myLine = document.createElement('div');
            let totalPanier = document.createElement('div');
            totalPanier.classList.add('ligne');
            myLine.classList.add('ligne');
            myLine.setAttribute('id', localStorage.getItem(index));
            myPanier.prepend(myLine);
            //creation de l'image
            let myImage = document.createElement('img');
            myImage.setAttribute('src', './img/'+localStorage.getItem('img'+index));
            myLine.appendChild(myImage);
            //creation du nom du produit
            let monTitre = document.createElement('div');
            monTitre.innerHTML = "<span>"+ localStorage.getItem('nom'+index) + "</span>";
            monTitre.classList.add('nomProduit');
            myLine.appendChild(monTitre);
            //creation button (-) pour diminuer la quantité
            let minButton = document.createElement('div');
            minButton.innerHTML = "<button class='min'>-</button>";
            minButton.classList.add('minus');
            myLine.appendChild(minButton);
            //creer l'indicateur de quantité
            let count = document.createElement('p');
            count.innerText= 1;
            count.classList.add('qte');
            count.setAttribute('id', 'a'+localStorage.getItem(index));
            myLine.appendChild(count);
            //creation button (+) pour augmenter la quantité
            let plusButton = document.createElement('div');
            plusButton.innerHTML = "<button class='plu'>+</button>";
            plusButton.classList.add('plus');
            myLine.appendChild(plusButton);
            //creation du prix
            let monPrix = document.createElement('div');
            monPrix.innerHTML = "<p> Prix: <span class='prix' id='prix"+localStorage.getItem(index)+"'>" + localStorage.getItem('prix'+index) +"</span> €"+"</p>" ;
            monPrix.classList.add('prixProduit');
            myLine.appendChild(monPrix);
            //creation du boutton supprimer
            let mySup = document.createElement('button');
            mySup.innerText = "X";
            mySup.classList.add('supButton');
            myLine.appendChild(mySup);
            
//--------------------------------
            minButton.addEventListener('click', articleMoins);
            minButton.addEventListener('click', total);
            plusButton.addEventListener('click', articlePlus);
            plusButton.addEventListener('click', total);
            mySup.addEventListener('click', supLigne);
        }
         //foction pour creer le total du panier
        //creer le prix total des achats
        let total = ()=>{
            let prixUnit;
            let prixTotal=0;
    
            if(document.querySelector('.panier').childNodes.length === 2){
                let totalPanier = document.createElement('div');
                totalPanier.classList.add('total');
                let prixGlobal = document.createElement('p');
                prixGlobal.classList.add('prixglobal')
                prixGlobal.innerHTML = "<p> Total des achats: <span id='prix-global'> "+ prixTotal.toFixed(2)+ "</span> €"+" </p>";
                totalPanier.appendChild(prixGlobal);
                document.querySelector('.panier').appendChild(totalPanier);
                let promo = document.createElement('p');
                promo.classList.add('promo');
                totalPanier.appendChild(promo);

            }

            for(let y=0; y<document.querySelectorAll('.ligne').length; y++){
                prixUnit = Number(document.querySelectorAll('.prix')[y].innerText);
                prixTotal += prixUnit;
                
                document.getElementById('prix-global').innerText = prixTotal.toFixed(2);
                maPromo();
            }
            
        }
        let maPromo = ()=>{
            if(Number(document.getElementById('prix-global').innerText)<600){
                let prixUnit;
                let prixTotal=0;
                for(let y=0; y<document.querySelectorAll('.ligne').length; y++){
                    prixUnit = Number(document.querySelectorAll('.prix')[y].innerText);
                    prixTotal += prixUnit;
                    
                    document.getElementById('prix-global').innerText = prixTotal.toFixed(2);
                    
                }
                let diff = (600-Number(document.getElementById('prix-global').innerText)).toFixed(2);
                document.querySelector('.promo').innerText = "Plus que "+diff+" € pour bénificier de 5% de réduction";
                
        } else{
            
            document.querySelector('.promo').innerText="Vous avez bénificié de 5% de réduction";
            document.getElementById('prix-global').innerText = (Number(document.getElementById('prix-global').innerText) - (Number(document.getElementById('prix-global').innerText)/20)).toFixed(2);
        }
        }
       
    }
}
result.open('POST', 'donnees.json', true);
result.send();

}