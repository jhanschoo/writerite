SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

rm -r "${SCRIPTPATH}/src/models"
cp -r "${SCRIPTPATH}/../frontend-react/src/models" "${SCRIPTPATH}/src/models"
sed -i "s/import { gql } from 'graphql.macro';/import gql from 'graphql-tag';/" ${SCRIPTPATH}/src/models/*