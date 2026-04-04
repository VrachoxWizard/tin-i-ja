import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/ui/GlowCard";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/formatters";

export interface DealRoomFileEntry {
  id: string;
  file_path: string;
  doc_type: string;
  uploaded_at: string;
  signedUrl: string | null;
}

interface DealRoomFileListProps {
  files: DealRoomFileEntry[];
}

export function DealRoomFileList({ files }: DealRoomFileListProps) {
  return (
    <GlowCard className="rounded-none border border-border overflow-hidden bg-card">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-base font-heading uppercase tracking-widest text-foreground">
          Trenutni dokumenti
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {files.length > 0 ? (
          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-muted/20 border border-border rounded-none"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {file.file_path.split("/").pop() || file.doc_type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {file.doc_type} · {formatDate(file.uploaded_at)}
                    </p>
                  </div>
                </div>
                {file.signedUrl ? (
                  <a href={file.signedUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-none">
                      Pregledaj
                    </Button>
                  </a>
                ) : (
                  <Button variant="outline" className="rounded-none" disabled>
                    Nedostupno
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-none">
            <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Još nema dodanih dokumenata.</p>
          </div>
        )}
      </CardContent>
    </GlowCard>
  );
}
