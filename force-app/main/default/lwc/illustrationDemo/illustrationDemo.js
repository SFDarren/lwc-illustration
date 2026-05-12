import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const ILLUSTRATIONS = [
    { name: 'no-content',    label: 'No Content',    heading: 'No Results Found',      body: 'Try adjusting your search or filters to find what you\'re looking for.' },
    { name: 'no-access',     label: 'No Access',     heading: 'Access Restricted',     body: 'You don\'t have permission to view this content. Contact your administrator.' },
    { name: 'no-connection', label: 'No Connection', heading: 'No Connection',         body: 'Check your network connection and try again.' },
    { name: 'error',         label: 'Error',         heading: 'Something Went Wrong',  body: 'An unexpected error occurred. Refresh the page or contact support.' },
    { name: 'desert',        label: 'Desert',        heading: 'Nothing Here Yet',      body: 'Get started by creating your first record.' },
];

const SIZES = ['small', 'large'];

export default class IllustrationDemo extends LightningElement {
    @track activeName = 'no-content';
    @track activeSize = 'small';
    @track showHeading = true;
    @track showBody = true;
    @track showAction = true;
    @track actionLabel = 'Take Action';

    get activeIllustration() {
        return ILLUSTRATIONS.find(i => i.name === this.activeName);
    }

    get activeHeading() {
        return this.showHeading ? this.activeIllustration.heading : undefined;
    }

    get activeBody() {
        return this.showBody ? this.activeIllustration.body : undefined;
    }

    get illustrationOptions() {
        return ILLUSTRATIONS.map(i => ({
            ...i,
            variant: i.name === this.activeName ? 'brand' : 'neutral',
        }));
    }

    get sizeOptions() {
        return SIZES.map(s => ({
            size: s,
            label: s.charAt(0).toUpperCase() + s.slice(1),
            variant: s === this.activeSize ? 'brand' : 'neutral',
        }));
    }

    get textOptions() {
        return [
            { key: 'heading', label: 'Heading', variant: this.showHeading ? 'brand' : 'neutral' },
            { key: 'body',    label: 'Body',    variant: this.showBody    ? 'brand' : 'neutral' },
            { key: 'action',  label: 'Action',  variant: this.showAction  ? 'brand' : 'neutral' },
        ];
    }

    get usageSnippet() {
        const h = this.showHeading ? ` heading="${this.activeIllustration.heading}"` : '';
        const b = this.showBody    ? ` body="${this.activeIllustration.body}"`       : '';
        const open = `<c-illustration name="${this.activeName}" size="${this.activeSize}"${h}${b}>`;
        if (!this.showAction) return `${open}\n</c-illustration>`;
        return `${open}\n  <lightning-button slot="actions"\n    label="${this.actionLabel}"\n    variant="brand"\n    onclick={handleAction}>\n  </lightning-button>\n</c-illustration>`;
    }

    handleIllustrationChange(event) {
        this.activeName = event.currentTarget.dataset.name;
    }

    handleSizeChange(event) {
        this.activeSize = event.currentTarget.dataset.size;
    }

    handleTextToggle(event) {
        const key = event.currentTarget.dataset.key;
        if (key === 'heading') this.showHeading = !this.showHeading;
        if (key === 'body')    this.showBody    = !this.showBody;
        if (key === 'action')  this.showAction  = !this.showAction;
    }

    handleActionLabelChange(event) {
        this.actionLabel = event.detail.value;
    }

    handleActionClick() {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Action triggered',
            message: `"${this.actionLabel}" was clicked`,
            variant: 'success',
        }));
    }
}
