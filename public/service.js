export function AppService() {

let report = {coke: 10, diet: 10, dp: 20, sprite: 15, fanta: 15, ginger: 10};

this.init = () => {
    let existingReport = localStorage.getItem('count');
    if (existingReport) {
      report = {
        ...JSON.parse(existingReport)
      };
    }
}

this.save = (report) => { 
    localStorage.setItem('count', JSON.stringify(report));
};



}


 
 