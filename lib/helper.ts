type Entry = {
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  academicqualification?: string; 

};

export function entriesToMarkdown(entries: Entry[], type: string) {
  if (!entries?.length) return "";

  // Check if any entry has 'institute' in the organization name (case-insensitive)
  const hasInstitute = true

  // You can return a different markdown structure if `hasInstitute` is true
  if (hasInstitute) {
    return (
      `## ${type} (Institutes)\n\n` +
      entries
        .map((entry) => {
          const dateRange = entry.current
            ? `${entry.startDate} - Present`
            : `${entry.startDate} - ${entry.endDate}`;
          return `### Academicqualification:${entry.academicqualification} Institute Name: ${entry.title}\nOrganization: ${entry.organization}\nDuration: ${dateRange}\n\nDescription: ${entry.description}`;
        })
        .join("\n\n")
    );
  }

  // Default structure
  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### Name: ${entry.title}\nOrganization: ${entry.organization}\nDuration: ${dateRange}\n\nDescription: ${entry.description}`;
      })
      .join("\n\n")
  );
}
