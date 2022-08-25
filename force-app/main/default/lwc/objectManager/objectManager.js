import { LightningElement, wire, track } from 'lwc';
import findObject from '@salesforce/apex/ObjectManagerCntrl.findObject';

const actions = [
    { label: 'Object Setup', name: 'objectSetup' },
 ];

const columns = [
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
            menuAlignment: 'left'
        }
    },
    { label: 'Label', fieldName: 'label' },
    { label: 'Plural Label', fieldName: 'pluralLabel' },
    { label: 'API Name', fieldName: 'apiName'},
    { label: 'Type', fieldName: 'type'}
]; 

export default class ObjectManager extends LightningElement {

    @track data = null;
    columns = columns;
    queryTerm = '';

    @wire(findObject, {
        keyword: "$queryTerm"
    }) wiredSObjects(result) {
        this.data = null;
        this.error = null;
        console.log("result", result);
        if (result.data) {
            this.data = JSON.parse(JSON.stringify(result.data));
            this.data = [...this.data].sort((a,b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0));
            this.data.forEach(v => {
                v.setup = '/lightning/setup/ObjectManager/' + v.apiName + '/Details/view';
            });
        }
        if (result.error) {
            this.error = result.error;
            console.error("Error", error);
        }
    }

    get showSpinner() {
        return !this.data && !this.error;
    }  

    handleSearchInputChange(evt){
        this.queryTerm = evt.target.value;
    }

    handleRowActions(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'objectSetup':
                window.open(row.setup, "_blank");
                break;
       }
    }
}