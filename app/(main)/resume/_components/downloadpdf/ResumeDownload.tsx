import React from "react";
import { Page, Text, View, Document} from "@react-pdf/renderer";
import ResumeDownloadPdfStule from "./style";
export default function ResumeDownload() {
  return (
    <Document>
      <Page size="A4" style={ResumeDownloadPdfStule.page}>
        <View style={ResumeDownloadPdfStule.section}>
          <Text>Section #1</Text>
        </View>
        <View style={ResumeDownloadPdfStule.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}
