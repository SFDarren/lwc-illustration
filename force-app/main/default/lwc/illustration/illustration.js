import { LightningElement, api } from 'lwc';
import defaultTemplate from './illustration.html';
import noAccessTemplate from './noAccess.html';
import noConnectionTemplate from './noConnection.html';
import errorTemplate from './error.html';
import desertTemplate from './desert.html';

const TEMPLATES = {
    'no-content':    defaultTemplate,
    'no-access':     noAccessTemplate,
    'no-connection': noConnectionTemplate,
    'error':         errorTemplate,
    'desert':        desertTemplate,
};

export default class Illustration extends LightningElement {
    @api name = 'no-content';
    @api size = 'small';
    @api heading;
    @api body;

    get containerClass() {
        return this.size === 'large'
            ? 'slds-illustration slds-illustration_large'
            : 'slds-illustration slds-illustration_small';
    }

    get hasHeading() {
        return !!this.heading;
    }

    get hasBody() {
        return !!this.body;
    }

    get hasText() {
        return this.hasHeading || this.hasBody;
    }

    render() {
        return TEMPLATES[this.name] ?? defaultTemplate;
    }
}
