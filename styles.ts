import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  title: {
    margin: 12,
    fontSize: 24,
    fontWeight: '600',
    textAlignVertical: 'center'
  },
  input: {
    margin: 12,
  },
  inputTextInput: {
    marginVertical: 12,
    padding: 10,
    borderWidth: 1
  },
  inputButtonWrapper: {
    marginVertical: 10
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
  adjustPreview: {},
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
    marginVertical: 10
  },
  output: {
    margin: 18
  }
})


