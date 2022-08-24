import { LightningElement, wire, track } from 'lwc';
import findObject from '@salesforce/apex/ObjectManagerCntrl.findObject';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Label', fieldName: 'label' },
    { label: 'Plural Label', fieldName: 'pluralLabel' },
    { label: 'API Name', fieldName: 'apiName'},
    { label: 'Type', fieldName: 'type'}
]; 

// search delay
const DELAY = 350;

export default class ObjectManager extends LightningElement {

    @track data = [];
    columns = columns;
    queryTerm = '';

    @wire(findObject, {
        keyword: "$queryTerm"
    }) wiredSObjects(result) {
        this.data = null;
        console.log("result", result);
        if (result.data) {
            this.data = [...result.data].sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
        }
        if (result.error) {
            console.error("Error", error);
        }
    }

    get showSpinner() {
        return !this.data && !this.error;
      }
      

    handleSearchInputChange(evt){
        this.queryTerm = evt.target.value;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(this.doSearch.bind(this), DELAY);

    }

    doSearch() {
        this.data = null;
        refreshApex(this.data);
    }

}