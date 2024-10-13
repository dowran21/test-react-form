import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {z} from "zod"
import { Button, TextInput } from "@mantine/core"
import '@mantine/core/styles.css';
import { TextInputAutocomplete } from "./components/TextInputAutocomplete";

function App() {

  const schema = z.object({
    name:z
      .string({ message: "Обязательное поле" })
      .regex(/^[\u0400-\u04FF\s]+$/, "только кирилица")
      .min(3, "минимум 3 символа")
      .max(20, "Максимум 20 символов"),
      
    code:z
      .string({ message: "Обязательное поле" })
      .regex(/^[0-9]+$/, "только цифры")
      .min(3, "Минимум 3 цифры")
      .max(20, "Максимум 20 символов"),
    characteristics:z
      .array(
        z.object({
          name:z
            .string({ message: "Обязательное поле" })
            .regex(/^[\u0400-\u04FF\s]+$/, "только кирилица")
            .min(3, "минимум 3 символа")
            .max(20, "Максимум 20 символов"),
            
          value:z
            .string({ message: "Обязательное поле" })
            .regex(/^[\u0400-\u04FF\s]+$/, "только кирилица")
            .min(3, "минимум 3 символа")
            .max(20, "Максимум 20 символов")
        
        })
      )
        .min(1, "Минимум одна характеристика")
        .superRefine((items, ctx) => {
          const uniqueItemsCount = new Set(items.map((value) => value.name)).size;
          const errorPosition = items.length - 1;
          if (uniqueItemsCount !== items.length) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Характеристики не должны быть похожы',
              path: [errorPosition, 'name']
            });
          }
        })
  })

  const {
    register,
    handleSubmit,
    formState:{errors},
    control,
    setValue,
    getValues,
    watch
  } = useForm({
    resolver:zodResolver(schema)
  })

  const {append, remove, fields} = useFieldArray({
    name:"characteristics",
    control:control,
    key:"id"
  }) 

  const onSubmit = (data)=>{
    console.log(data);
    alert("Форма отправлены")
  }
  const defaultCharacteristics = [
    "Цвет", 
    "Прочность", 
    "Тип упаковки"
  ]

  const defaultValues = [
    "Хрупкое", 
    "Взрывоопасное"
  ]

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-1/3 rounded-md border shadow shadow-inner h-full mt-6 px-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Controller
            name={"name"}
            control={control}
            render={({field:{onChange, value}})=>
              <TextInput
                label={"Название объявления"}
                onChange={onChange}
                value={value}
                className="p-3"
                error={errors.name?.message}
                placeholder="Только кирилица"
              />
            }
          />
          <Controller
            name={"code"}
            control={control}
            render={({field:{onChange, value}})=>
              <TextInput
                label={"Название объявления"}
                onChange={onChange}
                value={value}
                className="p-3"
                leftSection={"A2-"}
                error={errors.code?.message}
                placeholder="Только кирилица"
              />
            }
          />
          <Button onClick={()=>append({name:"", value:""})} className="mb-2 "> Добавить характеристику</Button>
          <p className="text-red-400">{errors?.characteristics?.message}</p>
          {fields?.map((item, index)=>
            <div key={item.id} className="w-full flex flex-row justify-center items-center">
              <TextInputAutocomplete
                setValue={(value)=>setValue(`characteristics.${index}.name`, value)}
                value={watch(`characteristics.${index}.name`)}
                error={errors?.characteristics ? errors?.characteristics[index]?.name?.message : ""}
                defaultOptions={defaultCharacteristics}
                label={"Характеристика"}
              />
              <TextInputAutocomplete
                setValue={(value)=>setValue(`characteristics.${index}.value`, value)}
                value={watch(`characteristics.${index}.value`)}
                error={errors?.characteristics ? errors?.characteristics[index]?.value?.message : ""}
                defaultOptions={defaultValues}
                label={"Значение"}
              />
              <Button onClick={()=>remove(index)} className="mb-2 mt-8"> Удалить</Button>
            </div>
          )}
          <div className="flex justify-center items-center pb-5">
            <Button type="submit">Отправить</Button>
          </div>

        </form>
        
      </div>
    </div>
  )
}

export default App
