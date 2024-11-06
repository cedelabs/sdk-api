function sizeof(str: string) {
  return new Blob([str]).size;
}

export function splitDataToChunks(
	limitSize: number,
	data: string,
	chunks: string[] = []
) {
	const dataLength = data.length;

  if (dataLength <= limitSize) {
    return [data]
  }

  const mid = Math.round(dataLength / 2);
	const parts = [data.slice(0, mid), data.slice(mid)];

  parts.forEach(part => {
    const partSize = sizeof(part);
    if (partSize > limitSize) {
      splitDataToChunks(limitSize, part, chunks)
    } else {
      chunks.push(part)
    }
  });

	return chunks;
}
