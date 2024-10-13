import { useCombobox, Combobox, TextInput } from "@mantine/core";



export function TextInputAutocomplete({value, setValue, error, defaultOptions, label}){
    // console.log(error)
    const combobox = useCombobox();
    const options = defaultOptions.map((item) => (
        <Combobox.Option value={item} key={item}>
          {item}
        </Combobox.Option>
      ));
    return (
        <Combobox
            onOptionSubmit={(optionValue)=>{
                setValue(optionValue);
                combobox.closeDropdown()
            }}
            store={combobox}
            withinPortal={false}
        >
            <Combobox.Target>
                <TextInput
                    label={label}
                    value={value}
                    onChange={(event)=>{
                        setValue(event.currentTarget.value);
                        combobox.openDropdown();
                        combobox.updateSelectedOptionIndex();
                    }}
                    className="p-3"
                    onClick={() => combobox.openDropdown()}
                    onFocus={() => combobox.openDropdown()}
                    onBlur={() => combobox.closeDropdown()}
                    error={error}
                />
            </Combobox.Target>
            <Combobox.Dropdown>
                <Combobox.Options>
                {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    )
}