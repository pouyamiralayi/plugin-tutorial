import {fromJS, OrderedMap} from 'immutable'
import {get, has} from 'lodash'
import makeUnique from "../../utils/makeUnique";

const initialState = fromJS({
  components: {},
  contentTypes: {},
  initialComponents: {},
  intialContentTypes: {},
  initialData: {},
  modifiedData: {},
  isLoading: true,
  isLoadingForDataToBeSet: true,
});

const reducer = (state, action) => {
    switch (action.type) {
      case 'EDIT_ATTRIBUTE': {
        const {
          attributeToSet: {name, ...rest},
          forTarget,
          targetUid,
          initialAttribute,
        } = action;
        let newState = state;
        const initialAttributeName = get(initialAttribute, ['name'], '');
        const pathToDataToEdit = ['component', 'contentType'].includes(forTarget)
          ? [forTarget]
          : [forTarget, targetUid];

        const isEditingComponentAttribute = rest.type === 'component';
        if (isEditingComponentAttribute) {
          newState = state.updateIn(
            ['modifiedData', 'components', rest.component],
            () => state.getIn(['components', rest.component])
          );
        }

        return newState.updateIn(
          ['modifiedData', ...pathToDataToEdit, 'schema'],
          obj => {
            const newObj = OrderedMap(
              obj
                .get('attributes')
                .keySeq()
                .reduce((acc, current) => {
                  const isEditingCurrentAttribute =
                    current === initialAttributeName;
                  if (isEditingCurrentAttribute) {
                    const currentUid = state.getIn([
                      'modifiedData',
                      ...pathToDataToEdit,
                      'uid',
                    ]);

                    // First update the current attribute with the value
                    acc[name] = fromJS(rest);
                  } else {
                    acc[current] = obj.getIn(['attributes', current]);
                  }
                  return acc;
                }, {})
            );
            return obj.set('attributes', newObj);
          })

      }
    }
  }
;