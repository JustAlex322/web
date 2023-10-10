import React, {useEffect, useState} from 'react';
import {
    useGetAllMonsterClassQuery, usePutMonsterClassMutation, useUploadMonsterClassMutation,
} from "../../services/witcher";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setCreatedNewMonster} from "../../features/monster/monsterSlice";
import EditingMonsterClass from "./EditingMonsterClass";
import withErrorAndLoadingHandling from "../HOC/withError/withErrorAndLoadingHandling";
import ModalFormPutClass from "./modalFormPutClass/ModalFormPutClass";
import CommonFormForClass from '../common/commonFormForClass/CommonFormForClass';
import { SubmitHandler } from 'react-hook-form';
import { FormFieldsClass } from '../common/commonFormForClass/formTypes';

const EditingMonsterClassContainer :React.FC = () => {

    const [modalIsVisible, setModalIsVisible] = useState(false)

    const { data, refetch, isLoading } = useGetAllMonsterClassQuery();

    const createdNewMonster = useAppSelector(state => state.monsterClass.createdNewMonsterClass)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (createdNewMonster) {
            refetch();
            dispatch(setCreatedNewMonster(false))
        }

    },[createdNewMonster])

    const [ triggerForUpload] = useUploadMonsterClassMutation()

    const onSubmit: SubmitHandler<FormFieldsClass> = async data => {
        const formData = new FormData();
        formData.append("classImg", data.monsterClassImg[0])

        await triggerForUpload({monsterClassName : data.monsterClassName, monsterClassImg : formData})
        dispatch(setCreatedNewMonster(true));
    }

    const [ triggerForUpdate] = usePutMonsterClassMutation();
    const idForUpdateClass = useAppSelector(state => state.monsterClass.idCurrentClass);

    const onSubmitUpdate: SubmitHandler<FormFieldsClass> = async data => {
        const formData = new FormData();
        formData.append("classImg", data.monsterClassImg[0])

        await triggerForUpdate({monsterClassName : data.monsterClassName, monsterClassImg : formData, id : Number(idForUpdateClass)})
        setModalIsVisible(false);
        dispatch(setCreatedNewMonster(true));
    }

    return (
        <>
            <CommonFormForClass
                submitButtonText="Создать класс"
                onSubmit={onSubmit}
            />
            {withErrorAndLoadingHandling(EditingMonsterClass)({data : data, isLoading : isLoading, opeModal : setModalIsVisible})}

            <ModalFormPutClass 
                modalIsOpen={modalIsVisible}
                closeModal={setModalIsVisible}
                onSubmit={onSubmitUpdate}
                submitButtonText="Обновить класс"
            />
        </>
    );
}

export default EditingMonsterClassContainer;