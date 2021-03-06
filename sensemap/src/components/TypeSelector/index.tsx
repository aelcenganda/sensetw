import * as React from 'react';
import * as cx from 'classnames';
import { Form, Checkbox } from 'semantic-ui-react';
import { noop } from '../../types/utils';
import './index.css';

interface Props<T extends string> {
  id?: string;
  typePrefix?: string;
  className?: string;
  disabled?: boolean;
  types: T[];
  typeNames?: { [key: string]: string };
  eachAs?: { [key: string]: React.ReactNode };
  type: T;
  onChange? (type: T): void;
}

const groupName = 'type-selector';

const capitalize = (str: string): string => {
  if (str.length === 0) {
    return str;
  }
  return str[0] + str.slice(1).toLowerCase();
};

function TypeSelector<T extends string>(props: Props<T>) {
  const {
    id,
    className = '',
    disabled = false,
    typePrefix = '',
    types,
    typeNames = {},
    eachAs = {},
    type,
    onChange = noop
  } = props;
  const classes = cx(groupName, className);
  const prefix = typePrefix ? `${typePrefix}__` : '';

  return (
    <div id={id} className={classes}>{
      types.map(ty => {
        const typeName = typeNames[ty];
        const wrapper = eachAs[ty];
        return (
          <Form.Field key={ty}>
            <Checkbox
              id={`${prefix}${(typeName || ty).toLowerCase()}-type`}
              as={wrapper}
              disabled={disabled}
              radio
              className={`${groupName}__${ty.toLowerCase()}`}
              label={typeName || capitalize(ty)}
              name={groupName}
              value={ty}
              checked={type === ty}
              onChange={() => onChange(ty)}
            />
          </Form.Field>
        );
      })
    }</div>
  );
}

export default TypeSelector;