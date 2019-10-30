import $ from "jquery";
class Forms{
    constructor(){
        this.form = $(".form");    
        this.resultsDiv = $("#results");
        this.inputCountry = $("#country");
        this.sessionStorage = sessionStorage.getItem('country')
        this.countryList = ['germany', 'poland', 'spain', 'france'];
        this.loader = $(".loader").hide();
        this.value = "";
        this.results;
        this.inputCountryVal = this.inputCountry.val(this.sessionStorage);
        this.events();
    }

    events(){
        this.form.submit(this.submitForm.bind(this));
        this.resultsDiv.on("click", ".results__header",  this.resultsCollapse.bind(this));
    }

    submitForm(e){
        e.preventDefault(); 
        this.inputCountryVal = this.inputCountry.val()
        this.sessionStorage = sessionStorage.setItem('country',this.inputCountryVal);
        const inputLowercase = this.inputCountryVal.toLowerCase();

        if (inputLowercase === "poland"  ){
            this.value = "PL";
        } else if (inputLowercase === "germany" ) {
            this.value= "DE";
        } else if (inputLowercase === "spain"){
            this.value = "ES"; 
        } else if (inputLowercase === "france" ){
            this.value = "FR";
        }
        
        this.resultsDiv.html("");

        if(this.countryList.indexOf(inputLowercase) !== -1){
            this.loader.show();
            $.get("https://api.openaq.org/v1/cities?limit=10&country=" + this.value, (response) => {
                this.results = response.results.map(item => item.city).join("|");
                $.ajax({
                    type: "GET",
                    url: "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&prop=description&titles=" + this.results, 
                    dataType: "jsonp",
                })
                .done((response) => { 
                    this.loader.hide();
                    this.resultsDiv.html(`
                            ${response.query.pages.map(item => `<div class="results"><p class="results__header">${item.title}</p><div class="results__body">${item.description ? item.description : 'No description' }</div></div>`).join('')}
                        `);
                });
            });
        } else {
            this.resultsDiv.html('<p class="error">You have selected a country outside of the list! <br> List of available countries (' + this.countryList + ')</p>'); 
        }
    }
    
    resultsCollapse(e){
        const target = $(e.target);
        console.log(target);
        target.parent().toggleClass("active");
        target.next(".results__body").slideToggle(300,"linear");
    }
}

export default Forms;