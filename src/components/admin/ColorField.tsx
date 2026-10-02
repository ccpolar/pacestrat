'use client'

import type { TextFieldClientComponent } from 'payload'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'

/** Hex text input paired with a native colour picker. */
export const ColorField: TextFieldClientComponent = ({ field, path: pathProp }) => {
  const path = pathProp ?? field.name
  const { value, setValue, showError } = useField<string>({ path })
  const hex = value ?? ''
  const swatch = /^#[0-9a-f]{6}$/i.test(hex) ? hex : /^#[0-9a-f]{3}$/i.test(hex) ? hex.replace(/\w/g, (c) => c + c) : '#000000'
  const id = `field-${path.replace(/\./g, '__')}`

  return (
    <div className={`field-type color-field${showError ? ' error' : ''}`} style={{ flex: '1 1 0', minWidth: 160 }}>
      <FieldLabel htmlFor={id} label={field.label} path={path} required={field.required} />
      <div className="color-field__row">
        <input
          type="color"
          className="color-field__swatch"
          value={swatch.toLowerCase()}
          onChange={(e) => setValue(e.target.value.toUpperCase())}
          aria-label={`${typeof field.label === 'string' ? field.label : field.name} colour picker`}
        />
        <input
          id={id}
          className="color-field__hex"
          type="text"
          value={hex}
          spellCheck={false}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <FieldError path={path} showError={showError} />
      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}
