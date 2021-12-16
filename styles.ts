import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  p: {
    marginHorizontal: 12,
    marginVertical: 3,
    fontSize: 16
  },
  a: {
    marginHorizontal: 12,
    marginTop: 1,
    marginBottom: 3,
    fontSize: 15,
    color: 'hsl(230, 90%, 60%)'
  },
  smallTitle: {
    marginHorizontal: 12,
    marginVertical: 3,
    fontWeight: 'bold',
    fontSize: 18
  },
  title: {
    marginHorizontal: 12,
    marginVertical: 9,
    fontSize: 24,
    fontWeight: 'bold',
    textAlignVertical: 'center'
  },
  sep: {
    fontSize: 9
  },
  about: {
    margin: 12
  },
  config: {
    margin: 12
  },
  configTextInput: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderColor: 'hsl(0, 0%, 25%)',
    borderWidth: 1,
    borderRadius: 2
  },
  configButtonWrapper: {
    margin: 12
  },
  input: {
    margin: 12,
  },
  inputTextInput: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderColor: 'hsl(0, 0%, 35%)',
    borderWidth: 1,
    borderRadius: 2
  },
  inputButtonWrapper: {
    margin: 12
  },
  adjust: {
      marginHorizontal: 14,
      marginTop: 0,
      marginBottom: 32
  },
  adjustItem: {
      marginVertical: 14,
      marginBottom: 0,
      padding: 12,
      borderBottomColor: '#333',
      borderWidth: 1
  },
  adjustTip: {
    marginTop: 6,
    marginBottom: 18
  },
  adjustPreview: {
    marginBottom: 9
  },
  adjustPreviewFocusRaw: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'hsl(0, 90%, 60%)'
  },
  adjustPreviewFocusAdjusted: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'hsl(88, 85%, 40%)'
  },
  adjustPreviewIgnore: {
    textDecorationLine: 'line-through',
    color: 'hsl(0, 0%, 60%)'
  },
  adjustPreviewFocusIgnore: {
    fontWeight: 'bold',
    fontSize: 20,
    textDecorationLine: 'line-through',
    color: 'hsl(0, 0%, 60%)'
  },
  adjustOption: {},
  adjustOptionCurrent: {
    backgroundColor: 'hsla(0, 0%, 0%, 0.075)'
  },
  adjustOptionValText: {
    fontSize: 20
  },
  adjustFinish: {
    padding: 12
  },
  adjustFinishTotal: {
    fontSize: 18
  },
  adjustFinishConfirmed: {
    fontSize: 18
  },
  adjustFinishButtonWrapper: {
    marginVertical: 12
  },
  output: {
    margin: 18
  },
  outputTip: {
    marginBottom: 9,
    fontSize: 16,
    fontWeight: 'bold'
  },
  outputGoHomeButtonWrapper: {
    marginVertical: 18,
    flexDirection: 'row'
  },
  outputGoHomeButton: {
    color: 'hsl(230, 90%, 60%)',
    fontSize: 16
  }
})


