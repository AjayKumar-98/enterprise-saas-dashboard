import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { Textarea } from '../../../components/Textarea';
import { Select } from '../../../components/Select';
import { campaignSchema, CampaignFormSchema } from '../schemas/campaignSchema';
import { useUnsavedChanges } from '../../../hooks/useUnsavedChanges';
import { useToast } from '../../../hooks/useToast';
import { campaignService } from '../../campaigns/services/campaignService';
import { Campaign } from '../../campaigns/types';

interface OverviewTabProps {
  campaign: Campaign;
  onUpdate: () => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  campaign,
  onUpdate,
}) => {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CampaignFormSchema>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: campaign.name,
      status: campaign.status,
      budget: campaign.budget,
      description: '',
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate.split('T')[0],
      targetAudience: '',
      objectives: '',
    },
  });

  useUnsavedChanges(isDirty);

  useEffect(() => {
    reset({
      name: campaign.name,
      status: campaign.status,
      budget: campaign.budget,
      description: '',
      startDate: campaign.startDate.split('T')[0],
      endDate: campaign.endDate.split('T')[0],
      targetAudience: '',
      objectives: '',
    });
  }, [campaign, reset]);

  const onSubmit = async (data: CampaignFormSchema) => {
    setIsSaving(true);
    try {
      await campaignService.updateCampaign(campaign.id, data);
      toast.success('Campaign updated successfully');
      reset(data);
      onUpdate();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update campaign'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Campaign Name"
          {...register('name')}
          error={errors.name?.message}
          disabled={isSaving}
        />

        <Select
          label="Status"
          {...register('status')}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'completed', label: 'Completed' },
            { value: 'draft', label: 'Draft' },
          ]}
          error={errors.status?.message}
          disabled={isSaving}
        />

        <Input
          label="Budget"
          type="number"
          {...register('budget', { valueAsNumber: true })}
          error={errors.budget?.message}
          disabled={isSaving}
        />

        <div />

        <Input
          label="Start Date"
          type="date"
          {...register('startDate')}
          error={errors.startDate?.message}
          disabled={isSaving}
        />

        <Input
          label="End Date"
          type="date"
          {...register('endDate')}
          error={errors.endDate?.message}
          disabled={isSaving}
        />
      </div>

      <Textarea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
        rows={4}
        disabled={isSaving}
      />

      <Textarea
        label="Target Audience"
        {...register('targetAudience')}
        error={errors.targetAudience?.message}
        rows={3}
        disabled={isSaving}
      />

      <Textarea
        label="Campaign Objectives"
        {...register('objectives')}
        error={errors.objectives?.message}
        rows={4}
        disabled={isSaving}
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          disabled={!isDirty || isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </form>
  );
};
