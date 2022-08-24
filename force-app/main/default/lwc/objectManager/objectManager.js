import { LightningElement } from 'lwc';
import getObjectsList from '@salesforce/apex/ObjectManagerCntrl.getObjectsList';
import findObject from '@salesforce/apex/ObjectManagerCntrl.findObject';

const columns = [
    { label: 'Label', fieldName: 'label' },
    { label: 'Plural Label', fieldName: 'pluralLabel' },
    { label: 'API Name', fieldName: 'apiName'},
    { label: 'Type', fieldName: 'type'}
];

// search delay
const DELAY = 350;


export default class ObjectManager extends LightningElement {

    data = [];
    columns = columns;
    queryTerm;
    showSpinner;

    connectedCallback() {
        this.showSpinner = true;
        getObjectsList()
            .then(result => {
                // sorting by Object label
                result.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
                this.data = result;
                this.showSpinner = false;
            })
            .catch(error => {
                alert(error);
                this.showSpinner = false;
            });
    }

    handleSearchInputChange(evt){
        this.queryTerm = evt.target.value;
        // find objects with a delayed search
        this.doDelayedSearch();
    }

    doDelayedSearch() {
       window.clearTimeout(this.delayTimeout);
       this.delayTimeout = setTimeout(() => {
           findObject({keyword: this.queryTerm})
               .then(result => {
                   result.sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
                   this.data = result
                   this.showSpinner = false;
               })
               .catch(error => {
                   alert(JSON.stringify(error));
                   this.showSpinner = false;
               });
       }, DELAY);
    }

}