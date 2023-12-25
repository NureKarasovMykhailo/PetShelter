import React, { useState } from 'react';
import ValidationError from '../../../class/ValidationError';
import GeneralForm from '../../forms/generalForm/GeneralForm';
import TextArea from '../../UI/input/textArea/TextArea';
import stl from '../addWorkOfferForm/AddWorkOfferForm.module.css';
import PhoneNumberInput from '../../UI/input/phoneNumberInput/PhoneNumberInput';
import { updateWorkOffer } from '../../../API/WorkOfferService';
import { useTranslation } from 'react-i18next';

const UpdateWorkOfferForm = ({ workOffer, setRefresh }) => {
    const { t } = useTranslation();

    const inputs = [
        { label: t('workTitle'), name: 'workTitle', id: 'workTitle', type: 'text' },
        { label: t('workEmail'), name: 'workEmail', id: 'workEmail', type: 'email' },
    ];
    const [workOfferData, setWorkOfferData] = useState({
        workTitle: workOffer.work_title,
        workEmail: workOffer.work_email,
    });
    const [workDescription, setWorkDescription] = useState(workOffer.work_description);
    const [workTelephone, setWorkTelephone] = useState(workOffer.work_telephone);
    const [errorList, setErrorList] = useState([new ValidationError()]);

    const handleUpdateWorkOffer = async (e) => {
        try {
            const formData = new FormData();
            formData.append('workTitle', workOfferData.workTitle);
            formData.append('workDescription', workDescription);
            formData.append('workEmail', workOfferData.workEmail);
            formData.append('workTelephone', workTelephone);

            await updateWorkOffer(workOffer.id, formData);
            setRefresh(true);
        } catch (error) {
            console.log(error);
            if (error.response) {
                if (error.response.status === 400) {
                    setErrorList(error.response.data.message);
                }
            }
        }
    };

    return (
        <GeneralForm
            inputs={inputs}
            data={workOfferData}
            setData={setWorkOfferData}
            header={t('updateWorkOffer')}
            submitButtonText={t('updateWorkOffer')}
            errorsList={errorList}
            onClick={handleUpdateWorkOffer}
        >
            <TextArea label={t('descriptionLabel')} text={workDescription} setText={setWorkDescription} />
            <div className={stl.phone}>
                <PhoneNumberInput
                    label={t('phoneNumberLabel')}
                    value={workTelephone}
                    onChange={setWorkTelephone}
                />
            </div>
        </GeneralForm>
    );
};

export default UpdateWorkOfferForm;
