/* eslint-disable */
import React, {Fragment} from 'react';
import { connect } from 'react-redux';
import Modal from '@andes/modal';
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';
import Button from '@andes/button';
import TextField from '@andes/textfield';

class ModalSelectSection extends React.Component {
    constructor(props) {
        super(props);
        this.isEditing = this.isEditing.bind(this);
        this.state = {
            editionMode: props.editing,
            path: undefined,
            section_id: undefined,
            new_section_name: undefined
        };
        this.changeCurrentPath = this.changeCurrentPath.bind(this);
        this.cambiarText = this.cambiarText.bind(this);
    }

    isEditing(props) {
        return props.editing || false;
    }

    componentWillMount() {
        if (this.isEditing(this.props)) {
            this.setState({ editionMode: true });
        } else {
            this.setState({ editionMode: false });
        }
    }

    componentDidUpdate(prevProps) {

    }

    changeCurrentPath(path, section_id) {
        this.setState({ path, section_id });
    }

    cambiarText(ev) {
        this.setState({ new_section_name: ev.target.value });
    }

    render() {
        return (
            this.props.sections ?
                <Modal
                    title={this.isEditing(this.props) ? 'Select section' : 'Select where add the section'}
                    closable={false}
                    className="modal-section"
                    onClose={this.props.onCloseSection}
                    type="loose"
                    visible={this.props.showing}
                    actions={
                        {
                            buttonFilled: <Button modifier="outline">Cancel</Button>,
                            buttonTransparent: <Button onClick={() => this.props.onSelectedSection(this.state.path, this.state.section_id, this.state.new_section_name)}>Save</Button>,
                        }
                    }>
                    {!this.isEditing(this.props) ? 
                    <Fragment>
                        <TextField className="modal-section--input" label="New name" onChange={this.cambiarText} />
                    </Fragment> 
                    : undefined}
                    <p className="modal-section--path">Current path: <span> {this.state.path} </span> </p>
                    <Accordion className="accordion__section" accordion={false} onChange={this.cambiado}>
                        {Object.keys(this.props.sections).map((level1) => {
                            return <AccordionItem className="accordion__section--lv1" key={level1} uuid={String(level1)} onClick={this.cambiado}>
                                    <AccordionItemTitle>
                                        <h4 onClick={() => this.changeCurrentPath(`${this.props.sections[level1].name}`, level1)}>{this.props.sections[level1].name}</h4>
                                    </AccordionItemTitle>
                                <AccordionItemBody>
                                    {Object.keys(this.props.sections[level1].childrens).map((level2) => {
                                        return <AccordionItem className="accordion__section--lv2" key={level2} uuid={String(level2)}>
                                            <AccordionItemTitle>
                                                <h4 onClick={() => this.changeCurrentPath(`${this.props.sections[level1].name} / ${this.props.sections[level1].childrens[level2].name}`, level2)}>{this.props.sections[level1].childrens[level2].name}</h4>
                                            </AccordionItemTitle>
                                            <AccordionItemBody>
                                                {Object.keys(this.props.sections[level1].childrens[level2].childrens).map((level3) => {
                                                    return <AccordionItem key={level3} uuid={String(level3)}>
                                                        <AccordionItemTitle><h4 onClick={() => this.changeCurrentPath(`${this.props.sections[level1].name} / ${this.props.sections[level1].childrens[level2].name} / ${this.props.sections[level1].childrens[level2].childrens[level3].name}`, level3)} >{this.props.sections[level1].childrens[level2].childrens[level3].name}</h4></AccordionItemTitle>
                                                    </AccordionItem>

                                                })}
                                            </AccordionItemBody>
                                        </AccordionItem>
                                    })}
                                </AccordionItemBody>
                            </AccordionItem>
                        })}
                    </Accordion>
           
                </Modal> : ''
        )
    }


}

const mapStateToProps = (state) => {
    return {
        sections: state.sections
    }
}

export default connect(mapStateToProps)(ModalSelectSection);