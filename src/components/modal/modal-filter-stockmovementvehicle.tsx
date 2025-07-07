import Modal from "@/components/modal/modal";
import { PageStockmovementvehicle } from "@/types/stockmovementvehicle";
import { NextPage } from "next/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { Form, Formik } from "formik";
import * as Yup from 'yup';
import ButtonSubmit from "@/components/formik/button-submit";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import DateField from "@/components/formik/date-field";


type Props = {
  show: boolean;
  onClickOverlay: () => void;
  filter: PageStockmovementvehicle
  setFilter: Dispatch<SetStateAction<PageStockmovementvehicle>>
}

const schema = Yup.object().shape({
});

const ModalFilterStockmovementvehicle: NextPage<Props> = ({ show, onClickOverlay, filter, setFilter }) => {

  const [initFormikValue, setInitFormikValue] = useState<PageStockmovementvehicle>(filter)

  const handleSubmit = async (values: PageStockmovementvehicle) => {
    setFilter(values)
    onClickOverlay()
  }

  const handleClear = () => {
    setFilter({
      fromWarehouseId: '',
      toWarehouseId: '',
      type: '',
      relatedId: '',
      productId: '',
      vehicleId: '',
      startSentGrossQuantity: '',
      startSentTareQuantity: '',
      startSentNetQuantity: '',
      startSentTime: '',
      startRecivedGrossQuantity: '',
      startRecivedTareQuantity: '',
      startRecivedNetQuantity: '',
      startRecivedTime: '',
      endSentGrossQuantity: '',
      endSentTareQuantity: '',
      endSentNetQuantity: '',
      endSentTime: '',
      endRecivedGrossQuantity: '',
      endRecivedTareQuantity: '',
      endRecivedNetQuantity: '',
      endRecivedTime: '',
      createName: '',
      startCreateDt: '',
      endCreateDt: '',
    })
    onClickOverlay()
  }

  const handleClearStartCreateDt = (setFieldValue) => {
    setFieldValue('startCreateDt', '')
  }

  const handleClearEndCreateDt = (setFieldValue) => {
    setFieldValue('endCreateDt', '')
  }

  useEffect(() => {
    if (show) {
      setInitFormikValue(filter)
    }
  }, [show])


  return (
    <Modal show={show} onClickOverlay={() => onClickOverlay()} layout={'sm:max-w-2xl'}>
      <div className="p-4">
        <div className={'text-xl mb-4 flex justify-between items-center'}>
          <div>Filter Stockmovementvehicle</div>
          <button type="button" onClick={() => onClickOverlay()} className={'h-10 w-10 flex justify-center items-center duration-300 rounded shadow text-rose-500 hover:scale-110'}>
            <IoClose size={'1.5rem'} className="text-rose-500" />
          </button>
        </div>
        <hr className="mb-4 border-gray-200" />
        <div>
          <div className="ml-auto">
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ setFieldValue }) => {
                return (
                  <Form noValidate={true}>
                    <div className="mb-4">
                      <TextField
                        label={'Stockmovementvehicle Name'}
                        name={'name'}
                        type={'text'}
                        placeholder={'Stockmovementvehicle Name'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Email'}
                        name={'email'}
                        type={'text'}
                        placeholder={'Email'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label={'Phone Number'}
                        name={'phoneNumber'}
                        type={'text'}
                        placeholder={'Phone Number'}
                      />
                    </div>
                    <div className="mb-4">
                      <TextAreaField
                        label={'Address'}
                        name={'address'}
                        placeholder={'Address'}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <DateField
                        label={'Created From'}
                        name={'startCreateDt'}
                        type={'date'}
                        handleClear={() => handleClearStartCreateDt(setFieldValue)}
                      />
                      <DateField
                        label={'Created To'}
                        name={'endCreateDt'}
                        type={'date'}
                        handleClear={() => handleClearEndCreateDt(setFieldValue)}
                      />
                    </div>
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <ButtonSubmit
                        label={'Clear Filter'}
                        type="reset"
                        onClick={() => handleClear()}
                        className={'duration-300 border-2 text-gray-600 border-gray-400 hover:bg-gray-100 hover:border-gray-500 focus:border-gray-500 h-10 rounded-md font-semibold px-4 w-full shadow-lg shadow-gray-500/20'}
                      />
                      <ButtonSubmit
                        label={'Filter'}
                      />
                    </div>
                  </Form>
                )
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ModalFilterStockmovementvehicle;