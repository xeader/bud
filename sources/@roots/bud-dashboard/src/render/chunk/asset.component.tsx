import {Box, Text} from 'ink'
import React from 'react'

import Title from '../display/title.component.js'
import {size as formatSize} from '../format.js'

const Asset = ({
  minWidth,
  name,
  size,
  emitted,
  final,
  indent,
}: {
  minWidth: number
  name: string
  size?: number
  emitted?: boolean
  final?: boolean
  indent?: any
}) => {
  return (
    <Title indent={indent} final={final}>
      <Box minWidth={minWidth} marginRight={2}>
        <Text>{name}</Text>
      </Box>

      {size && size > 0 ? (
        <Box minWidth={9} justifyContent="flex-end">
          <Text dimColor>{formatSize(size) as string}</Text>
        </Box>
      ) : null}
    </Title>
  )
}

export default Asset